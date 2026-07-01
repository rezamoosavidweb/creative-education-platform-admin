import { useServerQuery } from '@/lib/query'

export function useInstructorProfile() {
  return useServerQuery({
    request: {
      path: '/profiles/me/instructor',
      method: 'get',
    },
  })
}
