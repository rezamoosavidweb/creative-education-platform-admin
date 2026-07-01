import { useServerQuery } from '@/lib/query'

export function useOrganizationsList() {
  return useServerQuery({
    request: {
      method: 'get',
      path: '/organizations/mine',
    },
  })
}
