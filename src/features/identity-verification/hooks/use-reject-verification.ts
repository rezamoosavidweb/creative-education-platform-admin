import { apiQueryKeys, useServerMutation } from '@/lib/query'
import type { RejectVerificationRequest } from '../types'

type RejectVerificationVariables = {
  body: RejectVerificationRequest
  id: string
}

export function useRejectVerification() {
  return useServerMutation<
    '/profiles/verifications/{id}/reject',
    'post',
    RejectVerificationVariables
  >({
    invalidates: [
      apiQueryKeys.request({
        method: 'get',
        path: '/profiles/verifications/queue',
      }),
    ],
    request: (variables) => ({
      body: variables.body,
      method: 'post',
      path: '/profiles/verifications/{id}/reject',
      pathParams: { id: variables.id },
    }),
  })
}
