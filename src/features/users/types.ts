import type { ApiQueryParams, ApiResponseBody } from '@/lib/api'
import type { components } from '@/lib/api/schema'

export type AdminUser = components['schemas']['UserDto']
export type UsersListQuery = ApiQueryParams<'/users', 'get'>
export type UsersListResponse = ApiResponseBody<'/users', 'get'>
export type UsersListItem = NonNullable<UsersListResponse['data']>[number]
export type UsersOrder = NonNullable<UsersListQuery['order']>
