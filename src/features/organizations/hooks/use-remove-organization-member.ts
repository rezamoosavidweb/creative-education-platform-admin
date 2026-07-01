import { apiQueryKeys, useServerMutation } from '@/lib/query'

type RemoveOrganizationMemberVariables = {
  orgId: string
  userId: string
}

export function useRemoveOrganizationMember() {
  return useServerMutation<
    '/organizations/{id}/members/{userId}',
    'delete',
    RemoveOrganizationMemberVariables
  >({
    invalidates: (_data, variables) => [
      apiQueryKeys.request({
        method: 'get',
        path: '/organizations/{id}/members',
        pathParams: { id: variables.orgId },
      }),
    ],
    request: (variables) => ({
      method: 'delete',
      path: '/organizations/{id}/members/{userId}',
      pathParams: { id: variables.orgId, userId: variables.userId },
    }),
  })
}
