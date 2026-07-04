import {
  AxiosHeaders,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { afterEach, describe, expect, it } from 'vitest'
import { apiClient } from './client'
import { orvalApiClient } from './orval-mutator'

const originalAdapter = apiClient.defaults.adapter

afterEach(() => {
  apiClient.defaults.adapter = originalAdapter
})

describe('orvalApiClient', () => {
  it('delegates generated requests to the shared API client', async () => {
    const seen: InternalAxiosRequestConfig[] = []
    apiClient.defaults.adapter = createAdapter((config) => {
      seen.push(config)
      return createResponse(config, { id: 'user-1' })
    })

    const data = await orvalApiClient<{ id: string }>(
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
        url: '/auth/me',
      },
      {
        headers: {
          'X-Test': 'yes',
        },
      }
    )

    expect(data).toEqual({ id: 'user-1' })
    expect(seen[0].url).toBe('/auth/me')
    expect(seen[0].method).toBe('get')
    expect(AxiosHeaders.from(seen[0].headers).get('Content-Type')).toBe(
      'application/json'
    )
    expect(AxiosHeaders.from(seen[0].headers).get('X-Test')).toBe('yes')
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
  status = 200
): AxiosResponse {
  return {
    config,
    data,
    headers: {},
    request: {},
    status,
    statusText: status === 200 ? 'OK' : 'Error',
  }
}
