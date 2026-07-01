import type { ApiRequestBody, ApiResponseBody } from '@/lib/api'
import type { components } from '@/lib/api/schema'

export type AuthUser = components['schemas']['UserDto']
export type AuthTokenPayload = components['schemas']['TokenPayloadDto']
export type AuthSession = components['schemas']['SessionDto']
export type AuthOrganization = components['schemas']['OrganizationDto']
export type AuthCapability =
  components['schemas']['UserCapabilitiesDto']['capabilities'][number]

export type LoginRequest = ApiRequestBody<'/auth/login', 'post'>
export type LoginResponse = ApiResponseBody<'/auth/login', 'post'>
export type RefreshRequest = ApiRequestBody<'/auth/refresh', 'post'>
export type RefreshResponse = ApiResponseBody<'/auth/refresh', 'post'>

export type AuthTokens = {
  accessToken: AuthTokenPayload
  refreshToken: AuthTokenPayload
}

export type AuthContext = AuthTokens & {
  user: AuthUser
  capabilities: AuthCapability[]
  organizations: AuthOrganization[]
  currentOrganizationId: string | null
}

export type AuthStatus = 'anonymous' | 'restoring' | 'authenticated'
