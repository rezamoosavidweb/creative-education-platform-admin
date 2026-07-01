import { apiQueryKeys, useServerMutation } from '@/lib/query'

type RevokeSessionVariables = {
  sessionId: string
}

export function useRevokeActiveSession() {
  return useServerMutation<
    '/auth/sessions/{id}',
    'delete',
    RevokeSessionVariables
  >({
    invalidates: [
      apiQueryKeys.request({
        method: 'get',
        path: '/auth/sessions',
      }),
    ],
    request: (variables) => ({
      method: 'delete',
      path: '/auth/sessions/{id}',
      pathParams: { id: variables.sessionId },
    }),
  })
}
