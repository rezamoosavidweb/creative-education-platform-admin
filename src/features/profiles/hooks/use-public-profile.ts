import { createQueryKey, useServerQuery } from '@/lib/query'

export function usePublicProfile(handle: string | null) {
  return useServerQuery({
    enabled: !!handle,
    queryKey: createQueryKey('profiles', 'public', handle),
    request: {
      path: '/profiles/{handle}',
      method: 'get',
      pathParams: {
        handle: handle ?? '',
      },
    },
  })
}
