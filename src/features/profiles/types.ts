import type { ApiQueryParams, ApiRequestBody, ApiResponseBody } from '@/lib/api'
import type { components } from '@/lib/api/schema'

export type Profile = components['schemas']['ProfileDto']
export type DirectoryEntry = components['schemas']['DirectoryEntryDto']
export type PractitionerProfile =
  components['schemas']['PractitionerProfileDto']
export type InstructorProfile = components['schemas']['InstructorProfileDto']
export type StudioProfile = components['schemas']['StudioProfileDto']
export type PortfolioItem = components['schemas']['PortfolioItemDto']
export type AvailabilityStatus = components['schemas']['AvailabilityStatus']
export type VerificationStatus = components['schemas']['VerificationStatus']

export type DirectoryQuery = ApiQueryParams<'/directory', 'get'>
export type DirectoryResponse = ApiResponseBody<'/directory', 'get'>
export type MyProfileResponse = ApiResponseBody<'/profiles/me', 'get'>
export type PublicProfileResponse = ApiResponseBody<'/profiles/{handle}', 'get'>
export type UpdateProfileRequest = ApiRequestBody<'/profiles/me', 'patch'>
export type ChangeHandleRequest = ApiRequestBody<'/profiles/me/handle', 'patch'>
export type ChangeAvatarRequest = ApiRequestBody<'/profiles/me/avatar', 'patch'>
export type ChangeAvailabilityRequest = ApiRequestBody<
  '/profiles/me/practitioner/availability',
  'patch'
>
export type UpdateInstructorRequest = ApiRequestBody<
  '/profiles/me/instructor',
  'patch'
>
export type UpdateStudioRequest = ApiRequestBody<'/profiles/me/studio', 'patch'>
