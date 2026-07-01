import { apiQueryKeys, useServerMutation } from '@/lib/query'
import type { CapabilityKey } from '../types'

type RevokeCapabilityVariables = {
  capability: CapabilityKey
  userId: string
}

export function useRevokeCapability() {
  return useServerMutation<
    '/identity/users/{userId}/capabilities/{capability}',
    'delete',
    RevokeCapabilityVariables
  >({
    invalidates: (_data, variables) => [
      apiQueryKeys.request({
        method: 'get',
        path: '/identity/users/{userId}/capabilities',
        pathParams: { userId: variables.userId },
      }),
    ],
    request: (variables) => ({
      method: 'delete',
      path: '/identity/users/{userId}/capabilities/{capability}',
      pathParams: {
        userId: variables.userId,
        capability: variables.capability,
      },
    }),
  })
}
