import type {
  ApiRequestBody,
  ApiResponseBody,
} from '@/lib/api'
import type { components } from '@/lib/api/schema'

export type ProfileVerification = components['schemas']['ProfileVerificationDto']
export type ProfileType = components['schemas']['ProfileType']
export type VerificationStatus = components['schemas']['VerificationStatus']
export type RequestVerificationRequest = ApiRequestBody<
  '/profiles/me/verifications',
  'post'
>
export type RejectVerificationRequest = ApiRequestBody<
  '/profiles/verifications/{id}/reject',
  'post'
>
export type VerificationQueueResponse = ApiResponseBody<
  '/profiles/verifications/queue',
  'get'
>
