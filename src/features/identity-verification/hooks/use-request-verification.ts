import { apiQueryKeys, useServerMutation } from '@/lib/query'
import type { RequestVerificationRequest } from '../types'

export function useRequestVerification() {
  return useServerMutation<
    '/profiles/me/verifications',
    'post',
    RequestVerificationRequest
  >({
    invalidates: [
      apiQueryKeys.request({
        method: 'get',
        path: '/profiles/verifications/queue',
      }),
    ],
    request: (variables) => ({
      body: variables,
      method: 'post',
      path: '/profiles/me/verifications',
    }),
  })
}
