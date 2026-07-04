import { create } from 'zustand'
import type {
  AuthCapability,
  AuthOrganization,
  AuthStatus,
  AuthTokenPayload,
  AuthTokens,
  AuthUser,
} from '@/lib/auth/types'
import { getCookie, removeCookie, setCookie } from '@/lib/cookies'

const AUTH_SESSION_COOKIE = 'cep_admin_auth_session'

type PersistedAuthSession = {
  user: AuthUser | null
  accessToken: AuthTokenPayload | null
  refreshToken: AuthTokenPayload | null
  capabilities: AuthCapability[]
  organizations: AuthOrganization[]
  currentOrganizationId: string | null
}

interface AuthState {
  auth: {
    user: AuthUser | null
    accessToken: AuthTokenPayload | null
    refreshToken: AuthTokenPayload | null
    capabilities: AuthCapability[]
    organizations: AuthOrganization[]
    currentOrganizationId: string | null
    status: AuthStatus
    setUser: (user: AuthUser | null) => void
    setTokens: (tokens: AuthTokens | null) => void
    setSession: (session: {
      user: AuthUser
      tokens: AuthTokens
      capabilities: AuthCapability[]
      organizations: AuthOrganization[]
      currentOrganizationId?: string | null
    }) => void
    setCapabilities: (capabilities: AuthCapability[]) => void
    setOrganizations: (organizations: AuthOrganization[]) => void
    setCurrentOrganizationId: (organizationId: string | null) => void
    setStatus: (status: AuthStatus) => void
    reset: () => void
  }
}

export function createAuthStore() {
  const initialSession = readPersistedSession()

  return create<AuthState>()((set) => ({
    auth: {
      user: initialSession.user,
      accessToken: initialSession.accessToken,
      refreshToken: initialSession.refreshToken,
      capabilities: initialSession.capabilities,
      organizations: initialSession.organizations,
      currentOrganizationId: initialSession.currentOrganizationId,
      status: initialSession.refreshToken ? 'restoring' : 'anonymous',
      setUser: (user) =>
        set((state) =>
          commitSessionUpdate(state, {
            user,
            status:
              user && state.auth.accessToken && state.auth.refreshToken
                ? 'authenticated'
                : state.auth.status,
          })
        ),
      setTokens: (tokens) =>
        set((state) =>
          commitSessionUpdate(state, {
            accessToken: tokens?.accessToken ?? null,
            refreshToken: tokens?.refreshToken ?? null,
            status: tokens ? 'authenticated' : 'anonymous',
          })
        ),
      setSession: ({
        capabilities,
        currentOrganizationId,
        organizations,
        tokens,
        user,
      }) =>
        set((state) => {
          const nextCurrentOrganizationId = resolveCurrentOrganizationId(
            organizations,
            currentOrganizationId ?? state.auth.currentOrganizationId
          )

          return commitSessionUpdate(state, {
            accessToken: tokens.accessToken,
            capabilities,
            currentOrganizationId: nextCurrentOrganizationId,
            organizations,
            refreshToken: tokens.refreshToken,
            status: 'authenticated',
            user,
          })
        }),
      setCapabilities: (capabilities) =>
        set((state) => commitSessionUpdate(state, { capabilities })),
      setOrganizations: (organizations) =>
        set((state) =>
          commitSessionUpdate(state, {
            currentOrganizationId: resolveCurrentOrganizationId(
              organizations,
              state.auth.currentOrganizationId
            ),
            organizations,
          })
        ),
      setCurrentOrganizationId: (organizationId) =>
        set((state) =>
          commitSessionUpdate(state, {
            currentOrganizationId: resolveCurrentOrganizationId(
              state.auth.organizations,
              organizationId
            ),
          })
        ),
      setStatus: (status) =>
        set((state) => commitSessionUpdate(state, { status })),
      reset: () => {
        removeCookie(AUTH_SESSION_COOKIE)
        set((state) => ({
          ...state,
          auth: {
            ...state.auth,
            accessToken: null,
            capabilities: [],
            currentOrganizationId: null,
            organizations: [],
            refreshToken: null,
            status: 'anonymous',
            user: null,
          },
        }))
      },
    },
  }))
}

export const useAuthStore = createAuthStore()

function commitSessionUpdate(
  state: AuthState,
  patch: Partial<PersistedAuthSession> & { status?: AuthStatus }
): AuthState {
  const nextAuth = {
    ...state.auth,
    ...patch,
  }

  persistSession({
    accessToken: nextAuth.accessToken,
    capabilities: nextAuth.capabilities,
    currentOrganizationId: nextAuth.currentOrganizationId,
    organizations: nextAuth.organizations,
    refreshToken: nextAuth.refreshToken,
    user: nextAuth.user,
  })

  return {
    ...state,
    auth: nextAuth,
  }
}

function readPersistedSession(): PersistedAuthSession {
  const emptySession: PersistedAuthSession = {
    accessToken: null,
    capabilities: [],
    currentOrganizationId: null,
    organizations: [],
    refreshToken: null,
    user: null,
  }
  const cookie = getCookie(AUTH_SESSION_COOKIE)
  if (!cookie) return emptySession

  try {
    const parsed = JSON.parse(
      decodeURIComponent(cookie)
    ) as Partial<PersistedAuthSession>

    return {
      accessToken: isTokenPayload(parsed.accessToken)
        ? parsed.accessToken
        : null,
      capabilities: Array.isArray(parsed.capabilities)
        ? parsed.capabilities.filter(isString)
        : [],
      currentOrganizationId:
        typeof parsed.currentOrganizationId === 'string'
          ? parsed.currentOrganizationId
          : null,
      organizations: Array.isArray(parsed.organizations)
        ? parsed.organizations
        : [],
      refreshToken: isTokenPayload(parsed.refreshToken)
        ? parsed.refreshToken
        : null,
      user: parsed.user && typeof parsed.user === 'object' ? parsed.user : null,
    }
  } catch {
    removeCookie(AUTH_SESSION_COOKIE)
    return emptySession
  }
}

function persistSession(session: PersistedAuthSession): void {
  if (!session.refreshToken && !session.accessToken && !session.user) {
    removeCookie(AUTH_SESSION_COOKIE)
    return
  }

  setCookie(AUTH_SESSION_COOKIE, encodeURIComponent(JSON.stringify(session)))
}

function resolveCurrentOrganizationId(
  organizations: AuthOrganization[],
  preferredOrganizationId: string | null | undefined
): string | null {
  if (
    preferredOrganizationId &&
    organizations.some(
      (organization) => organization.id === preferredOrganizationId
    )
  ) {
    return preferredOrganizationId
  }

  return organizations[0]?.id ?? null
}

function isTokenPayload(value: unknown): value is AuthTokenPayload {
  return (
    !!value &&
    typeof value === 'object' &&
    'token' in value &&
    typeof value.token === 'string' &&
    'expiresIn' in value &&
    typeof value.expiresIn === 'number'
  )
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}
