import { useServerQuery } from '@/lib/query'

export function useActiveSessionsList() {
  return useServerQuery({
    request: {
      method: 'get',
      path: '/auth/sessions',
    },
  })
}
