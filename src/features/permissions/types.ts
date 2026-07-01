import type {
  ApiRequestBody,
  ApiResponseBody,
} from '@/lib/api'
import type { components } from '@/lib/api/schema'
import type { UsersListItem, UsersListQuery } from '@/features/users/types'

export type CapabilityUser = UsersListItem
export type CapabilityUsersQuery = UsersListQuery
export type UserCapabilitiesResponse = ApiResponseBody<
  '/identity/users/{userId}/capabilities',
  'get'
>
export type GrantCapabilityRequest = ApiRequestBody<
  '/identity/users/{userId}/capabilities',
  'post'
>
export type CapabilityKey =
  components['schemas']['UserCapabilitiesDto']['capabilities'][number]

export type CapabilityGroup = {
  capabilities: CapabilityKey[]
  name: string
}
