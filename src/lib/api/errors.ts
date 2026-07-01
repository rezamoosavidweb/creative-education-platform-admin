import { AxiosError, isAxiosError } from 'axios'

export type ApiErrorKind =
  | 'http'
  | 'network'
  | 'timeout'
  | 'canceled'
  | 'unknown'

export class ApiError extends Error {
  readonly kind: ApiErrorKind
  readonly status?: number
  readonly body?: unknown
  readonly originalError: unknown

  constructor({
    body,
    kind,
    message,
    originalError,
    status,
  }: {
    body?: unknown
    kind: ApiErrorKind
    message: string
    originalError: unknown
    status?: number
  }) {
    super(message)
    this.name = 'ApiError'
    this.kind = kind
    this.status = status
    this.body = body
    this.originalError = originalError
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export function getApiErrorMessage(error: unknown): string {
  return toApiError(error).message
}

export function toApiError(error: unknown): ApiError {
  if (isApiError(error)) return error

  if (isNoContentStatus(error)) {
    return new ApiError({
      kind: 'http',
      status: 204,
      message: 'No content.',
      originalError: error,
    })
  }

  if (isAxiosError(error)) {
    return fromAxiosError(error)
  }

  return new ApiError({
    kind: 'unknown',
    message: 'Something went wrong!',
    originalError: error,
  })
}

function fromAxiosError(error: AxiosError): ApiError {
  const status = error.response?.status
  const body = error.response?.data
  const message = readErrorMessage(body) ?? fallbackMessage(error)

  return new ApiError({
    kind: resolveAxiosKind(error),
    status,
    body,
    message,
    originalError: error,
  })
}

function resolveAxiosKind(error: AxiosError): ApiErrorKind {
  if (error.code === AxiosError.ERR_CANCELED) return 'canceled'
  if (error.code === AxiosError.ECONNABORTED) return 'timeout'
  if (error.response) return 'http'
  if (error.request) return 'network'
  return 'unknown'
}

function fallbackMessage(error: AxiosError): string {
  if (error.code === AxiosError.ERR_CANCELED) return 'Request canceled.'
  if (error.code === AxiosError.ECONNABORTED) return 'Request timed out.'
  return 'Something went wrong!'
}

function readErrorMessage(body: unknown): string | undefined {
  if (!body || typeof body !== 'object') return undefined
  const record = body as Record<string, unknown>

  for (const key of ['title', 'message', 'error']) {
    if (key in record) {
      const value = record[key]
      if (typeof value === 'string' && value.trim().length > 0) {
        return value
      }
      if (Array.isArray(value)) {
        const first = value.find(
          (item): item is string =>
            typeof item === 'string' && item.trim().length > 0
        )
        if (first) return first
      }
    }
  }

  return undefined
}

function isNoContentStatus(error: unknown): boolean {
  return (
    !!error &&
    typeof error === 'object' &&
    'status' in error &&
    Number(error.status) === 204
  )
}
