import { apiQueryKeys, useServerMutation } from '@/lib/query'
import { profileQueryKeys } from '../services/profiles-query'

export function usePublishProfile() {
  return useServerMutation({
    invalidates: [
      apiQueryKeys.operation('/profiles/me', 'get'),
      profileQueryKeys.directory(),
    ],
    request: {
      path: '/profiles/me/publish',
      method: 'post',
    },
  })
}
