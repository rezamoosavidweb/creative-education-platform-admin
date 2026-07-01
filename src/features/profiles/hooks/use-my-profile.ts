import { useServerQuery } from '@/lib/query'

export function useMyProfile() {
  return useServerQuery({
    request: {
      path: '/profiles/me',
      method: 'get',
    },
  })
}
