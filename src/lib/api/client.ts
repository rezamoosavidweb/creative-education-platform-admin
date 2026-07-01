import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { ApiError, toApiError } from './errors'
import type {
  ApiHttpMethod,
  ApiMethod,
  ApiPath,
  ApiRequestOptions,
  ApiResponseBody,
  ApiResult,
} from './types'

const DEFAULT_API_TIMEOUT_MS = 30_000
const NEXT_CURSOR_HEADER = 'x-next-cursor'

type ApiRetryDecision = {
  retry: boolean
}

type ApiAuthRetryHandler = (
  error: ApiError
) => ApiRetryDecision | Promise<ApiRetryDecision>

type ApiAccessTokenProvider = () => string | null | undefined

declare module 'axios' {
  interface AxiosRequestConfig {
    _apiAuthHeaderManaged?: boolean
    _apiAuthRetryAttempted?: boolean
    _apiSkipAuthHeader?: boolean
    _apiSkipAuthRetry?: boolean
  }

  interface InternalAxiosRequestConfig {
    _apiAuthHeaderManaged?: boolean
    _apiAuthRetryAttempted?: boolean
    _apiSkipAuthHeader?: boolean
    _apiSkipAuthRetry?: boolean
  }
}

const baseURL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') ?? ''
const timeout = parseTimeout(import.meta.env.VITE_API_TIMEOUT_MS)

let authRetryHandler: ApiAuthRetryHandler | null = null
let accessTokenProvider: ApiAccessTokenProvider | null = null

export const apiClient = axios.create({
  baseURL,
  timeout,
})

apiClient.interceptors.request.use((config) => {
  const headers = AxiosHeaders.from(config.headers)

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json')
  }

  if (
    !config._apiSkipAuthHeader &&
    (!headers.has('Authorization') || config._apiAuthHeaderManaged)
  ) {
    const accessToken = accessTokenProvider?.()
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`)
      config._apiAuthHeaderManaged = true
    }
  }

  config.headers = headers
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    const apiError = toApiError(error)

    if (shouldAskAuthLayerForRetry(error, apiError)) {
      const config = error.config
      config._apiAuthRetryAttempted = true
      const decision = await authRetryHandler!(apiError)

      if (decision.retry) {
        return apiClient.request(config)
      }
    }

    return Promise.reject(apiError)
  }
)

export function setApiAuthRetryHandler(
  handler: ApiAuthRetryHandler | null
): void {
  authRetryHandler = handler
}

export function setApiAccessTokenProvider(
  provider: ApiAccessTokenProvider | null
): void {
  accessTokenProvider = provider
}

export function createApiAbortController(): AbortController {
  return new AbortController()
}

export async function apiRequest<
  Path extends ApiPath,
  Method extends ApiMethod<Path>,
>(
  options: ApiRequestOptions<Path, Method>
): Promise<ApiResult<ApiResponseBody<Path, Method>>> {
  const response = await apiClient.request<ApiResponseBody<Path, Method>>({
    data: 'body' in options ? options.body : undefined,
    headers: buildHeaders(options.headers, options.idempotencyKey),
    method: options.method,
    params: 'query' in options ? options.query : undefined,
    responseType: options.responseType,
    signal: options.signal,
    _apiSkipAuthHeader: options.skipAuthHeader,
    _apiSkipAuthRetry: options.skipAuthRetry,
    timeout: options.timeoutMs,
    url: buildApiPath(
      options.path,
      'pathParams' in options ? options.pathParams : undefined
    ),
  })

  return toApiResult<ApiResponseBody<Path, Method>>(response)
}

export async function apiUpload<
  Path extends ApiPath,
  Method extends ApiMethod<Path>,
>(
  options: Omit<ApiRequestOptions<Path, Method>, 'body'> & {
    formData: FormData
  }
): Promise<ApiResult<ApiResponseBody<Path, Method>>> {
  const response = await apiClient.request<ApiResponseBody<Path, Method>>({
    data: options.formData,
    headers: buildHeaders(options.headers, options.idempotencyKey),
    method: options.method,
    params: 'query' in options ? options.query : undefined,
    signal: options.signal,
    _apiSkipAuthHeader: options.skipAuthHeader,
    _apiSkipAuthRetry: options.skipAuthRetry,
    timeout: options.timeoutMs,
    url: buildApiPath(
      options.path,
      'pathParams' in options ? options.pathParams : undefined
    ),
  })

  return toApiResult<ApiResponseBody<Path, Method>>(response)
}

export async function apiDownload<
  Path extends ApiPath,
  Method extends ApiMethod<Path>,
>(
  options: Omit<ApiRequestOptions<Path, Method>, 'body' | 'responseType'>
): Promise<ApiResult<Blob>> {
  const response = await apiClient.request<Blob>({
    headers: buildHeaders(options.headers, options.idempotencyKey),
    method: options.method,
    params: 'query' in options ? options.query : undefined,
    responseType: 'blob',
    signal: options.signal,
    _apiSkipAuthHeader: options.skipAuthHeader,
    _apiSkipAuthRetry: options.skipAuthRetry,
    timeout: options.timeoutMs,
    url: buildApiPath(
      options.path,
      'pathParams' in options ? options.pathParams : undefined
    ),
  })

  return toApiResult<Blob>(response)
}

function shouldAskAuthLayerForRetry(
  error: unknown,
  apiError: ApiError
): error is AxiosError & { config: InternalAxiosRequestConfig } {
  return (
    !!authRetryHandler &&
    error instanceof AxiosError &&
    !!error.config &&
    !error.config._apiAuthRetryAttempted &&
    !error.config._apiSkipAuthRetry &&
    apiError.status === 401
  )
}

function buildHeaders(
  headers: Record<string, string> | undefined,
  idempotencyKey: string | undefined
): Record<string, string> {
  return {
    ...headers,
    ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
  }
}

function buildApiPath(path: ApiPath, pathParams: unknown | undefined): string {
  return String(path).replace(/\{([^}]+)\}/g, (_match, key: string) => {
    const value = readPathParam(pathParams, key)
    return encodeURIComponent(String(value))
  })
}

function readPathParam(pathParams: unknown, key: string): string | number {
  if (!pathParams || typeof pathParams !== 'object' || !(key in pathParams)) {
    throw new ApiError({
      kind: 'unknown',
      message: `Missing path parameter: ${key}`,
      originalError: undefined,
    })
  }

  const value = pathParams[key as keyof typeof pathParams]
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new ApiError({
      kind: 'unknown',
      message: `Invalid path parameter: ${key}`,
      originalError: value,
    })
  }

  return value
}

function toApiResult<Data>(response: AxiosResponse<Data>): ApiResult<Data> {
  return {
    data: response.data,
    status: response.status,
    headers: response.headers as Record<string, unknown>,
    nextCursor: extractNextCursor(response),
  }
}

function extractNextCursor(response: AxiosResponse): string | null {
  const value = response.headers[NEXT_CURSOR_HEADER]
  if (typeof value === 'string' && value.length > 0) return value
  return null
}

function parseTimeout(value: string | undefined): number {
  if (!value) return DEFAULT_API_TIMEOUT_MS
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_API_TIMEOUT_MS
}

export type {
  ApiAccessTokenProvider,
  ApiAuthRetryHandler,
  ApiRetryDecision,
  ApiHttpMethod,
}
