import { useServerQuery } from '@/lib/query'

export function useVerificationQueue() {
  return useServerQuery({
    request: {
      method: 'get',
      path: '/profiles/verifications/queue',
    },
  })
}
