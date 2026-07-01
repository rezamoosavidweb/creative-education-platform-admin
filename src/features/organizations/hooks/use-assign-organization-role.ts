import { apiQueryKeys, useServerMutation } from '@/lib/query'
import type { AssignOrgRoleRequest } from '../types'

type AssignOrganizationRoleVariables = {
  body: AssignOrgRoleRequest
  orgId: string
  userId: string
}

export function useAssignOrganizationRole() {
  return useServerMutation<
    '/organizations/{id}/members/{userId}',
    'patch',
    AssignOrganizationRoleVariables
  >({
    invalidates: (_data, variables) => [
      apiQueryKeys.request({
        method: 'get',
        path: '/organizations/{id}/members',
        pathParams: { id: variables.orgId },
      }),
    ],
    request: (variables) => ({
      body: variables.body,
      method: 'patch',
      path: '/organizations/{id}/members/{userId}',
      pathParams: { id: variables.orgId, userId: variables.userId },
    }),
  })
}
