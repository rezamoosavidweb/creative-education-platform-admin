import { useServerQuery } from '@/lib/query'

export function useUserDetails(userId: string) {
  return useServerQuery({
    request: {
      method: 'get',
      path: '/users/{id}',
      pathParams: { id: userId },
    },
  })
}
