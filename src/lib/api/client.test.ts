import {
  AxiosError,
  AxiosHeaders,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  apiClient,
  apiRequest,
  createApiAbortController,
  setApiAuthRetryHandler,
} from './client'
import { ApiError } from './errors'

const originalAdapter = apiClient.defaults.adapter

beforeEach(() => {
  setApiAuthRetryHandler(null)
})

afterEach(() => {
  apiClient.defaults.adapter = originalAdapter
  setApiAuthRetryHandler(null)
  vi.restoreAllMocks()
})

describe('apiClient infrastructure', () => {
  it('sends typed requests with path params, timeout, signal, and idempotency key', async () => {
    const abortController = createApiAbortController()
    const seen: InternalAxiosRequestConfig[] = []
    apiClient.defaults.adapter = createAdapter((config) => {
      seen.push(config)
      return createResponse(config, undefined)
    })

    await apiRequest({
      path: '/users/{id}',
      method: 'get',
      pathParams: {
        id: 'user 1',
      },
      idempotencyKey: 'idem-1',
      signal: abortController.signal,
      timeoutMs: 1234,
    })

    const config = seen[0]
    const headers = AxiosHeaders.from(config.headers)

    expect(config.url).toBe('/users/user%201')
    expect(config.method).toBe('get')
    expect(config.signal).toBe(abortController.signal)
    expect(config.timeout).toBe(1234)
    expect(headers.get('Accept')).toContain('application/json')
    expect(headers.get('Idempotency-Key')).toBe('idem-1')
  })

  it('returns response metadata and X-Next-Cursor', async () => {
    apiClient.defaults.adapter = createAdapter((config) =>
      createResponse(config, { capabilities: ['course.publish'] }, 200, {
        'x-next-cursor': 'cursor-2',
      })
    )

    const result = await apiRequest({
      path: '/identity/me/capabilities',
      method: 'get',
    })

    expect(result.data.capabilities).toEqual(['course.publish'])
    expect(result.status).toBe(200)
    expect(result.nextCursor).toBe('cursor-2')
  })

  it('maps axios failures to ApiError', async () => {
    apiClient.defaults.adapter = createAdapter((config) => {
      throw createAxiosError(config, 422, { title: 'Validation failed' })
    })

    await expect(
      apiRequest({
        path: '/auth/me',
        method: 'get',
      })
    ).rejects.toMatchObject({
      kind: 'http',
      status: 422,
      message: 'Validation failed',
    })
  })

  it('does not retry failed requests without an auth retry handler', async () => {
    let calls = 0
    apiClient.defaults.adapter = createAdapter((config) => {
      calls += 1
      throw createAxiosError(config, 401, { title: 'Expired' })
    })

    await expect(
      apiRequest({
        path: '/auth/me',
        method: 'get',
      })
    ).rejects.toBeInstanceOf(ApiError)

    expect(calls).toBe(1)
  })

  it('retries once when the auth layer explicitly asks for it', async () => {
    let calls = 0
    const retryHandler = vi.fn(() => ({ retry: true }))
    setApiAuthRetryHandler(retryHandler)

    apiClient.defaults.adapter = createAdapter((config) => {
      calls += 1

      if (calls === 1) {
        throw createAxiosError(config, 401, { title: 'Expired' })
      }

      return createResponse(config, { id: 'user-1' })
    })

    const result = await apiRequest({
      path: '/auth/me',
      method: 'get',
    })

    expect(result.data.id).toBe('user-1')
    expect(calls).toBe(2)
    expect(retryHandler).toHaveBeenCalledOnce()
  })
})

function createAdapter(
  handler: (
    config: InternalAxiosRequestConfig
  ) => AxiosResponse | Promise<AxiosResponse>
): AxiosAdapter {
  return async (config) => handler(config)
}

function createResponse(
  config: InternalAxiosRequestConfig,
  data: unknown,
  status = 200,
  headers: Record<string, string> = {}
): AxiosResponse {
  return {
    config,
    data,
    headers,
    request: {},
    status,
    statusText: status === 200 ? 'OK' : 'Error',
  }
}

function createAxiosError(
  config: InternalAxiosRequestConfig,
  status: number,
  data: unknown
): AxiosError {
  return new AxiosError(
    'Request failed',
    undefined,
    config,
    {},
    createResponse(config, data, status)
  )
}
