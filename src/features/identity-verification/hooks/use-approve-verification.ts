import { apiQueryKeys, useServerMutation } from '@/lib/query'

type ApproveVerificationVariables = {
  id: string
}

export function useApproveVerification() {
  return useServerMutation<
    '/profiles/verifications/{id}/approve',
    'post',
    ApproveVerificationVariables
  >({
    invalidates: [
      apiQueryKeys.request({
        method: 'get',
        path: '/profiles/verifications/queue',
      }),
    ],
    request: (variables) => ({
      method: 'post',
      path: '/profiles/verifications/{id}/approve',
      pathParams: { id: variables.id },
    }),
  })
}
