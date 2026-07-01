import { apiQueryKeys, useServerMutation } from '@/lib/query'
import type { CapabilityKey } from '../types'

type GrantCapabilityVariables = {
  capability: CapabilityKey
  userId: string
}

export function useGrantCapability() {
  return useServerMutation<
    '/identity/users/{userId}/capabilities',
    'post',
    GrantCapabilityVariables
  >({
    invalidates: (_data, variables) => [
      apiQueryKeys.request({
        method: 'get',
        path: '/identity/users/{userId}/capabilities',
        pathParams: { userId: variables.userId },
      }),
    ],
    request: (variables) => ({
      body: { capability: variables.capability },
      method: 'post',
      path: '/identity/users/{userId}/capabilities',
      pathParams: { userId: variables.userId },
    }),
  })
}
