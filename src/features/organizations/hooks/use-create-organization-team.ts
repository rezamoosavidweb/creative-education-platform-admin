import { apiQueryKeys, useServerMutation } from '@/lib/query'
import type { CreateTeamRequest } from '../types'

type CreateOrganizationTeamVariables = {
  body: CreateTeamRequest
  orgId: string
}

export function useCreateOrganizationTeam() {
  return useServerMutation<
    '/organizations/{id}/teams',
    'post',
    CreateOrganizationTeamVariables
  >({
    invalidates: (_data, variables) => [
      apiQueryKeys.request({
        method: 'get',
        path: '/organizations/{id}/teams',
        pathParams: { id: variables.orgId },
      }),
    ],
    request: (variables) => ({
      body: variables.body,
      method: 'post',
      path: '/organizations/{id}/teams',
      pathParams: { id: variables.orgId },
    }),
  })
}
