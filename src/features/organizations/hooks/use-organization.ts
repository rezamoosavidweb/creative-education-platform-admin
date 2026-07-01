import { useServerQuery } from '@/lib/query'

export function useOrganization(id: string) {
  return useServerQuery({
    request: {
      method: 'get',
      path: '/organizations/{id}',
      pathParams: { id },
    },
  })
}
