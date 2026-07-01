import { useServerQuery } from '@/lib/query'

export function usePractitionerProfile() {
  return useServerQuery({
    request: {
      path: '/profiles/me/practitioner',
      method: 'get',
    },
  })
}
