import { useServerQuery } from '@/lib/query'

export function useStudioProfile() {
  return useServerQuery({
    request: {
      path: '/profiles/me/studio',
      method: 'get',
    },
  })
}
