import type { ApiResponseBody } from '@/lib/api'
import type { components } from '@/lib/api/schema'

export type AdminSession = components['schemas']['SessionDto']
export type ActiveSessionsResponse = ApiResponseBody<'/auth/sessions', 'get'>
