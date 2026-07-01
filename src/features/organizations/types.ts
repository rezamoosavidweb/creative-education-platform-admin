import type { ApiRequestBody, ApiResponseBody } from '@/lib/api'
import type { components } from '@/lib/api/schema'

export type Organization = components['schemas']['OrganizationDto']
export type OrgMembership = components['schemas']['OrgMembershipDto']
export type Team = components['schemas']['TeamDto']
export type OrgType = components['schemas']['OrgType']
export type OrgRole = components['schemas']['OrgRole']
export type MembershipStatus = components['schemas']['MembershipStatus']

export type OrganizationsResponse = ApiResponseBody<
  '/organizations/mine',
  'get'
>
export type OrganizationResponse = ApiResponseBody<'/organizations/{id}', 'get'>
export type OrganizationMembersResponse = ApiResponseBody<
  '/organizations/{id}/members',
  'get'
>
export type OrganizationTeamsResponse = ApiResponseBody<
  '/organizations/{id}/teams',
  'get'
>
export type CreateOrganizationRequest = ApiRequestBody<
  '/organizations',
  'post'
>
export type AddMemberRequest = ApiRequestBody<
  '/organizations/{id}/members',
  'post'
>
export type AssignOrgRoleRequest = ApiRequestBody<
  '/organizations/{id}/members/{userId}',
  'patch'
>
export type CreateTeamRequest = ApiRequestBody<
  '/organizations/{id}/teams',
  'post'
>
