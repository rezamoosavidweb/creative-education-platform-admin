import { apiQueryKeys, useServerMutation } from '@/lib/query'
import type { CreateOrganizationRequest } from '../types'

export function useCreateOrganization() {
  return useServerMutation<
    '/organizations',
    'post',
    CreateOrganizationRequest
  >({
    invalidates: [
      apiQueryKeys.request({
        method: 'get',
        path: '/organizations/mine',
      }),
    ],
    request: (variables) => ({
      body: variables,
      method: 'post',
      path: '/organizations',
    }),
  })
}
