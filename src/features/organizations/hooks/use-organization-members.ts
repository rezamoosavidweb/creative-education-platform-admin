import { useServerQuery } from '@/lib/query'

export function useOrganizationMembers(id: string) {
  return useServerQuery({
    request: {
      method: 'get',
      path: '/organizations/{id}/members',
      pathParams: { id },
    },
  })
}
