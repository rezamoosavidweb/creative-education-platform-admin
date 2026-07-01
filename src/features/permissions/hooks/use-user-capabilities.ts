import { useServerQuery } from '@/lib/query'

export function useUserCapabilities(userId: string | null) {
  return useServerQuery({
    enabled: !!userId,
    request: {
      method: 'get',
      path: '/identity/users/{userId}/capabilities',
      pathParams: { userId: userId ?? '' },
    },
  })
}
