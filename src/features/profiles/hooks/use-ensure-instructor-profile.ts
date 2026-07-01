import { apiQueryKeys, useServerMutation } from '@/lib/query'
import { profileQueryKeys } from '../services/profiles-query'

export function useEnsureInstructorProfile() {
  return useServerMutation({
    invalidates: [
      apiQueryKeys.operation('/profiles/me/instructor', 'get'),
      profileQueryKeys.directory(),
    ],
    request: {
      path: '/profiles/me/instructor',
      method: 'post',
    },
  })
}
