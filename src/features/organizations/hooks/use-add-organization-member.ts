import { apiQueryKeys, useServerMutation } from '@/lib/query'
import type { AddMemberRequest } from '../types'

type AddOrganizationMemberVariables = {
  body: AddMemberRequest
  orgId: string
}

export function useAddOrganizationMember() {
  return useServerMutation<
    '/organizations/{id}/members',
    'post',
    AddOrganizationMemberVariables
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
      method: 'post',
      path: '/organizations/{id}/members',
      pathParams: { id: variables.orgId },
    }),
  })
}
