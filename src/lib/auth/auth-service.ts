import { isAxiosError } from 'axios'
import { useAuthStore } from '@/stores/auth-store'
import {
  apiRequest,
  setApiAccessTokenProvider,
  setApiAuthRetryHandler,
  type ApiAuthRetryHandler,
} from '@/lib/api'
import type {
  AuthCapability,
  AuthContext,
  AuthOrganization,
  AuthSession,
  AuthTokens,
  AuthUser,
  LoginRequest,
  LoginResponse,
  RefreshResponse,
} from './types'

let initialized = false
let refreshPromise: Promise<boolean> | null = null
let restorePromise: Promise<boolean> | null = null

export function initializeAuthentication(): void {
  if (initialized) return

  setApiAccessTokenProvider(() => getAccessToken())
  setApiAuthRetryHandler(handleAuthRetry)
  initialized = true
}

export async function login(credentials: LoginRequest): Promise<AuthContext> {
  const response = await apiRequest({
    path: '/auth/login',
    method: 'post',
    body: credentials,
    skipAuthHeader: true,
    skipAuthRetry: true,
  })

  return applyLoginPayload(response.data)
}

export async function logout(): Promise<void> {
  try {
    if (useAuthStore.getState().auth.accessToken) {
      await apiRequest({
        path: '/auth/logout',
        method: 'post',
      })
    }
  } finally {
    clearAuthSession()
  }
}

export async function restoreSession(): Promise<boolean> {
  if (restorePromise) return restorePromise

  restorePromise = restoreSessionOnce().finally(() => {
    restorePromise = null
  })

  return restorePromise
}

export async function ensureAuthSession(): Promise<boolean> {
  const { auth } = useAuthStore.getState()

  if (auth.status === 'authenticated' && auth.user) {
    return true
  }

  if (!auth.refreshToken) {
    clearAuthSession()
    return false
  }

  return restoreSession()
}

export async function refreshSession(): Promise<boolean> {
  if (refreshPromise) return refreshPromise

  refreshPromise = rotateRefreshToken().finally(() => {
    refreshPromise = null
  })

  return refreshPromise
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await apiRequest({
    path: '/auth/me',
    method: 'get',
  })

  return response.data
}

export async function getCurrentCapabilities(): Promise<AuthCapability[]> {
  const response = await apiRequest({
    path: '/identity/me/capabilities',
    method: 'get',
  })

  return response.data.capabilities
}

export async function getCurrentOrganizations(): Promise<AuthOrganization[]> {
  const response = await apiRequest({
    path: '/organizations/mine',
    method: 'get',
  })

  return response.data
}

export async function listActiveSessions(): Promise<AuthSession[]> {
  const response = await apiRequest({
    path: '/auth/sessions',
    method: 'get',
  })

  return response.data
}

export async function revokeSession(sessionId: string): Promise<void> {
  await apiRequest({
    path: '/auth/sessions/{id}',
    method: 'delete',
    pathParams: { id: sessionId },
  })
}

export function clearAuthSession(): void {
  useAuthStore.getState().auth.reset()
}

export function getSafeAuthRedirect(redirectTo?: string): string {
  if (
    redirectTo &&
    redirectTo.startsWith('/') &&
    !redirectTo.startsWith('//') &&
    !redirectTo.startsWith('/sign-in') &&
    !redirectTo.startsWith('/sign-up')
  ) {
    return redirectTo
  }

  return '/'
}

export function resetAuthRuntimeForTests(): void {
  initialized = false
  refreshPromise = null
  restorePromise = null
  setApiAccessTokenProvider(null)
  setApiAuthRetryHandler(null)
}

const handleAuthRetry: ApiAuthRetryHandler = async (error) => {
  if (!shouldRefresh(error.status, getFailedRequestUrl(error.originalError))) {
    return { retry: false }
  }

  return { retry: await refreshSession() }
}

async function applyLoginPayload(payload: LoginResponse): Promise<AuthContext> {
  const tokens = toAuthTokens(payload)
  useAuthStore.getState().auth.setSession({
    capabilities: [],
    organizations: [],
    tokens,
    user: payload.user,
  })

  try {
    const authContext = await loadAuthContext(payload.user, tokens)
    commitAuthContext(authContext)
    return authContext
  } catch (error) {
    clearAuthSession()
    throw error
  }
}

async function restoreSessionOnce(): Promise<boolean> {
  const { auth } = useAuthStore.getState()
  const tokens = readStoredTokens()

  if (!tokens) {
    clearAuthSession()
    return false
  }

  auth.setStatus('restoring')

  try {
    const user = await getCurrentUser()
    const authContext = await loadAuthContext(user, tokens)
    commitAuthContext(authContext)
    return true
  } catch {
    clearAuthSession()
    return false
  }
}

async function loadAuthContext(
  user: AuthUser,
  tokens: AuthTokens
): Promise<AuthContext> {
  const [capabilities, organizations] = await Promise.all([
    getCurrentCapabilities(),
    getCurrentOrganizations(),
  ])
  const currentTokens = readStoredTokens() ?? tokens
  const currentOrganizationId = resolveCurrentOrganizationId(
    organizations,
    useAuthStore.getState().auth.currentOrganizationId
  )

  return {
    ...currentTokens,
    capabilities,
    currentOrganizationId,
    organizations,
    user,
  }
}

function commitAuthContext(authContext: AuthContext): void {
  useAuthStore.getState().auth.setSession({
    capabilities: authContext.capabilities,
    currentOrganizationId: authContext.currentOrganizationId,
    organizations: authContext.organizations,
    tokens: {
      accessToken: authContext.accessToken,
      refreshToken: authContext.refreshToken,
    },
    user: authContext.user,
  })
}

async function rotateRefreshToken(): Promise<boolean> {
  const refreshToken = useAuthStore.getState().auth.refreshToken?.token

  if (!refreshToken) {
    clearAuthSession()
    return false
  }

  try {
    const response = await apiRequest({
      path: '/auth/refresh',
      method: 'post',
      body: { refreshToken },
      skipAuthHeader: true,
      skipAuthRetry: true,
    })

    commitRotatedTokens(response.data)
    return true
  } catch {
    clearAuthSession()
    return false
  }
}

function commitRotatedTokens(payload: RefreshResponse): void {
  useAuthStore.getState().auth.setTokens(toAuthTokens(payload))
}

function toAuthTokens(payload: LoginResponse | RefreshResponse): AuthTokens {
  return {
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
  }
}

function readStoredTokens(): AuthTokens | null {
  const { accessToken, refreshToken } = useAuthStore.getState().auth
  if (!accessToken || !refreshToken) return null

  return { accessToken, refreshToken }
}

function getAccessToken(): string | null {
  return useAuthStore.getState().auth.accessToken?.token ?? null
}

function shouldRefresh(
  status: number | undefined,
  requestUrl: string | undefined
): boolean {
  return (
    status === 401 &&
    requestUrl !== '/auth/login' &&
    requestUrl !== '/auth/refresh'
  )
}

function getFailedRequestUrl(error: unknown): string | undefined {
  if (!isAxiosError(error)) return undefined
  return error.config?.url
}

function resolveCurrentOrganizationId(
  organizations: AuthOrganization[],
  preferredOrganizationId: string | null
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
