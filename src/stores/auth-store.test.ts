import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { AuthOrganization, AuthTokens, AuthUser } from '@/lib/auth'

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

async function importAuthStore() {
  const { useAuthStore } = await import('./auth-store')
  return useAuthStore
}

const sampleUser: AuthUser = {
  id: 'user-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  email: 'user@example.com',
  firstName: 'Jordan',
  lastName: 'Davis',
  role: 'ADMIN',
}

const sampleTokens: AuthTokens = {
  accessToken: {
    expiresIn: 900,
    token: 'access-token',
  },
  refreshToken: {
    expiresIn: 604800,
    token: 'refresh-token',
  },
}

const sampleOrganizations: AuthOrganization[] = [
  {
    id: 'org-1',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    disciplineIds: [],
    name: 'Creative Studio',
    type: 'STUDIO',
  },
]

describe('useAuthStore', () => {
  beforeEach(() => {
    cookies.clear()
    vi.resetModules()
  })

  it('starts anonymous when no session is persisted', async () => {
    const useAuthStore = await importAuthStore()

    expect(useAuthStore.getState().auth.status).toBe('anonymous')
    expect(useAuthStore.getState().auth.accessToken).toBeNull()
    expect(useAuthStore.getState().auth.refreshToken).toBeNull()
    expect(useAuthStore.getState().auth.user).toBeNull()
  })

  it('persists the backend session so a new store instance can restore it', async () => {
    const useAuthStore = await importAuthStore()
    useAuthStore.getState().auth.setSession({
      capabilities: ['identity.capability.read'],
      organizations: sampleOrganizations,
      tokens: sampleTokens,
      user: sampleUser,
    })

    vi.resetModules()
    const useAuthStoreAfterReload = await importAuthStore()
    const auth = useAuthStoreAfterReload.getState().auth

    expect(auth.status).toBe('restoring')
    expect(auth.user).toEqual(sampleUser)
    expect(auth.accessToken).toEqual(sampleTokens.accessToken)
    expect(auth.refreshToken).toEqual(sampleTokens.refreshToken)
    expect(auth.capabilities).toEqual(['identity.capability.read'])
    expect(auth.currentOrganizationId).toBe('org-1')
  })

  it('rotates tokens without clearing user context', async () => {
    const useAuthStore = await importAuthStore()
    useAuthStore.getState().auth.setSession({
      capabilities: ['course.publish'],
      organizations: sampleOrganizations,
      tokens: sampleTokens,
      user: sampleUser,
    })

    useAuthStore.getState().auth.setTokens({
      accessToken: { expiresIn: 900, token: 'access-token-2' },
      refreshToken: { expiresIn: 604800, token: 'refresh-token-2' },
    })

    const auth = useAuthStore.getState().auth
    expect(auth.user).toEqual(sampleUser)
    expect(auth.accessToken?.token).toBe('access-token-2')
    expect(auth.refreshToken?.token).toBe('refresh-token-2')
    expect(auth.capabilities).toEqual(['course.publish'])
  })

  it('keeps current organization within the backend organization list', async () => {
    const useAuthStore = await importAuthStore()
    useAuthStore.getState().auth.setSession({
      capabilities: [],
      currentOrganizationId: 'missing-org',
      organizations: sampleOrganizations,
      tokens: sampleTokens,
      user: sampleUser,
    })

    expect(useAuthStore.getState().auth.currentOrganizationId).toBe('org-1')
  })

  it('reset clears session state and drops persistence', async () => {
    const useAuthStore = await importAuthStore()
    useAuthStore.getState().auth.setSession({
      capabilities: ['course.publish'],
      organizations: sampleOrganizations,
      tokens: sampleTokens,
      user: sampleUser,
    })

    useAuthStore.getState().auth.reset()

    expect(useAuthStore.getState().auth.status).toBe('anonymous')
    expect(useAuthStore.getState().auth.user).toBeNull()
    expect(useAuthStore.getState().auth.accessToken).toBeNull()
    expect(useAuthStore.getState().auth.refreshToken).toBeNull()

    vi.resetModules()
    const useAuthStoreAfterReload = await importAuthStore()

    expect(useAuthStoreAfterReload.getState().auth.user).toBeNull()
    expect(useAuthStoreAfterReload.getState().auth.accessToken).toBeNull()
  })
})
