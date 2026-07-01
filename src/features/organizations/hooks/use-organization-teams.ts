import { useServerQuery } from '@/lib/query'

export function useOrganizationTeams(id: string) {
  return useServerQuery({
    request: {
      method: 'get',
      path: '/organizations/{id}/teams',
      pathParams: { id },
    },
  })
}
