import {
  AxiosError,
  AxiosHeaders,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { AuthOrganization, AuthTokens, AuthUser } from './types'

const cookies = new Map<string, string>()

vi.mock('@/lib/cookies', () => ({
  getCookie: vi.fn((name: string) => cookies.get(name)),
  removeCookie: vi.fn((name: string) => {
    cookies.delete(name)
  }),
  setCookie: vi.fn((name: string, value: string) => {
    cookies.set(name, value)
  }),
}))

const sampleUser: AuthUser = {
  id: 'user-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  email: 'user@example.com',
  firstName: 'Jordan',
  lastName: 'Davis',
  role: 'ADMIN',
}

const sampleOrganization: AuthOrganization = {
  id: 'org-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  disciplineIds: [],
  name: 'Creative Studio',
  type: 'STUDIO',
}

const initialTokens: AuthTokens = {
  accessToken: { expiresIn: 900, token: 'access-old' },
  refreshToken: { expiresIn: 604800, token: 'refresh-old' },
}

const rotatedTokens: AuthTokens = {
  accessToken: { expiresIn: 900, token: 'access-new' },
  refreshToken: { expiresIn: 604800, token: 'refresh-new' },
}

async function setup() {
  vi.resetModules()
  const api = await import('@/lib/api')
  const authService = await import('./auth-service')
  const authStore = await import('@/stores/auth-store')

  authService.resetAuthRuntimeForTests()
  authService.initializeAuthentication()

  return {
    ...api,
    ...authService,
    useAuthStore: authStore.useAuthStore,
  }
}

describe('auth service', () => {
  beforeEach(() => {
    cookies.clear()
    vi.clearAllMocks()
  })

  it('logs in with backend tokens and loads capabilities and organizations', async () => {
    const { apiClient, login, useAuthStore } = await setup()
    const calls: InternalAxiosRequestConfig[] = []

    apiClient.defaults.adapter = createAdapter((config) => {
      calls.push(config)

      if (config.url === '/auth/login') {
        expect(
          AxiosHeaders.from(config.headers).get('Authorization')
        ).toBeUndefined()
        return createResponse(config, {
          user: sampleUser,
          ...initialTokens,
        })
      }

      if (config.url === '/identity/me/capabilities') {
        expect(AxiosHeaders.from(config.headers).get('Authorization')).toBe(
          'Bearer access-old'
        )
        return createResponse(config, {
          capabilities: ['identity.capability.read'],
        })
      }

      if (config.url === '/organizations/mine') {
        return createResponse(config, [sampleOrganization])
      }

      throw new Error(`Unexpected request: ${config.url}`)
    })

    await login({ email: 'user@example.com', password: 'password123' })

    const auth = useAuthStore.getState().auth
    expect(auth.status).toBe('authenticated')
    expect(auth.user).toEqual(sampleUser)
    expect(auth.accessToken).toEqual(initialTokens.accessToken)
    expect(auth.refreshToken).toEqual(initialTokens.refreshToken)
    expect(auth.capabilities).toEqual(['identity.capability.read'])
    expect(auth.currentOrganizationId).toBe('org-1')
    expect(calls.map((call) => call.url)).toEqual([
      '/auth/login',
      '/identity/me/capabilities',
      '/organizations/mine',
    ])
  })

  it('restores a persisted session through auth/me and context endpoints', async () => {
    const { apiClient, restoreSession, useAuthStore } = await setup()
    useAuthStore.getState().auth.setSession({
      capabilities: [],
      organizations: [],
      tokens: initialTokens,
      user: sampleUser,
    })

    apiClient.defaults.adapter = createAdapter((config) => {
      if (config.url === '/auth/me') {
        return createResponse(config, sampleUser)
      }

      if (config.url === '/identity/me/capabilities') {
        return createResponse(config, { capabilities: ['course.publish'] })
      }

      if (config.url === '/organizations/mine') {
        return createResponse(config, [sampleOrganization])
      }

      throw new Error(`Unexpected request: ${config.url}`)
    })

    await expect(restoreSession()).resolves.toBe(true)
    expect(useAuthStore.getState().auth.status).toBe('authenticated')
    expect(useAuthStore.getState().auth.capabilities).toEqual([
      'course.publish',
    ])
    expect(useAuthStore.getState().auth.currentOrganizationId).toBe('org-1')
  })

  it('rotates refresh tokens and replays the failed request once', async () => {
    const { apiClient, apiRequest, useAuthStore } = await setup()
    useAuthStore.getState().auth.setSession({
      capabilities: [],
      organizations: [],
      tokens: initialTokens,
      user: sampleUser,
    })
    let refreshCalls = 0
    let meCalls = 0
    const meAuthorizationHeaders: Array<string | undefined> = []
    const refreshSkipAuthHeaderFlags: Array<boolean | undefined> = []

    apiClient.defaults.adapter = createAdapter((config) => {
      if (config.url === '/auth/me') {
        meCalls += 1
        meAuthorizationHeaders.push(readAuthorizationHeader(config))

        if (!config._apiAuthRetryAttempted) {
          throw createAxiosError(config, 401, { title: 'Expired' })
        }

        return createResponse(config, sampleUser)
      }

      if (config.url === '/auth/refresh') {
        refreshCalls += 1
        refreshSkipAuthHeaderFlags.push(config._apiSkipAuthHeader)
        return createResponse(config, rotatedTokens)
      }

      throw new Error(`Unexpected request: ${config.url}`)
    })

    const result = await apiRequest({ path: '/auth/me', method: 'get' })

    expect(result.data).toEqual(sampleUser)
    expect(meCalls).toBe(2)
    expect(refreshCalls).toBe(1)
    expect(meAuthorizationHeaders).toEqual([
      'Bearer access-old',
      'Bearer access-new',
    ])
    expect(refreshSkipAuthHeaderFlags).toEqual([true])
    expect(useAuthStore.getState().auth.accessToken).toEqual(
      rotatedTokens.accessToken
    )
  })

  it('queues concurrent 401 recoveries behind one refresh request', async () => {
    const { apiClient, apiRequest, useAuthStore } = await setup()
    useAuthStore.getState().auth.setSession({
      capabilities: [],
      organizations: [],
      tokens: initialTokens,
      user: sampleUser,
    })
    let refreshCalls = 0

    apiClient.defaults.adapter = createAdapter(async (config) => {
      if (config.url === '/auth/refresh') {
        refreshCalls += 1
        await Promise.resolve()
        return createResponse(config, rotatedTokens)
      }

      if (config.url === '/auth/me') {
        if (!config._apiAuthRetryAttempted) {
          throw createAxiosError(config, 401, { title: 'Expired' })
        }
        return createResponse(config, sampleUser)
      }

      if (config.url === '/identity/me/capabilities') {
        if (!config._apiAuthRetryAttempted) {
          throw createAxiosError(config, 401, { title: 'Expired' })
        }
        return createResponse(config, { capabilities: ['course.publish'] })
      }

      throw new Error(`Unexpected request: ${config.url}`)
    })

    await Promise.all([
      apiRequest({ path: '/auth/me', method: 'get' }),
      apiRequest({ path: '/identity/me/capabilities', method: 'get' }),
    ])

    expect(refreshCalls).toBe(1)
    expect(useAuthStore.getState().auth.refreshToken).toEqual(
      rotatedTokens.refreshToken
    )
  })

  it('clears the local session when refresh rotation fails', async () => {
    const { apiClient, apiRequest, useAuthStore } = await setup()
    useAuthStore.getState().auth.setSession({
      capabilities: ['course.publish'],
      organizations: [sampleOrganization],
      tokens: initialTokens,
      user: sampleUser,
    })

    apiClient.defaults.adapter = createAdapter((config) => {
      if (config.url === '/auth/me') {
        throw createAxiosError(config, 401, { title: 'Expired' })
      }

      if (config.url === '/auth/refresh') {
        throw createAxiosError(config, 401, { title: 'Invalid refresh token' })
      }

      throw new Error(`Unexpected request: ${config.url}`)
    })

    await expect(
      apiRequest({ path: '/auth/me', method: 'get' })
    ).rejects.toMatchObject({
      status: 401,
    })
    expect(useAuthStore.getState().auth.status).toBe('anonymous')
    expect(useAuthStore.getState().auth.refreshToken).toBeNull()
  })

  it('logs out through the backend and clears local session state', async () => {
    const { apiClient, logout, useAuthStore } = await setup()
    useAuthStore.getState().auth.setSession({
      capabilities: [],
      organizations: [],
      tokens: initialTokens,
      user: sampleUser,
    })

    apiClient.defaults.adapter = createAdapter((config) => {
      expect(config.url).toBe('/auth/logout')
      expect(AxiosHeaders.from(config.headers).get('Authorization')).toBe(
        'Bearer access-old'
      )
      return createResponse(config, undefined)
    })

    await logout()

    expect(useAuthStore.getState().auth.status).toBe('anonymous')
    expect(useAuthStore.getState().auth.accessToken).toBeNull()
  })

  it('revokes one active session through the generated auth sessions path', async () => {
    const { apiClient, revokeSession } = await setup()

    apiClient.defaults.adapter = createAdapter((config) => {
      expect(config.url).toBe('/auth/sessions/session%201')
      expect(config.method).toBe('delete')
      return createResponse(config, undefined)
    })

    await revokeSession('session 1')
  })
})

function createAdapter(
  handler: (
    config: InternalAxiosRequestConfig
  ) => AxiosResponse | Promise<AxiosResponse>
): AxiosAdapter {
  return async (config) => handler(config)
}

function readAuthorizationHeader(
  config: InternalAxiosRequestConfig
): string | undefined {
  const value = AxiosHeaders.from(config.headers).get('Authorization')
  return typeof value === 'string' ? value : undefined
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
