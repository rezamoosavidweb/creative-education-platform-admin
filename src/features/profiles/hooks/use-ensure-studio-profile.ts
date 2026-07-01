import { apiQueryKeys, useServerMutation } from '@/lib/query'
import { profileQueryKeys } from '../services/profiles-query'

export function useEnsureStudioProfile() {
  return useServerMutation({
    invalidates: [
      apiQueryKeys.operation('/profiles/me/studio', 'get'),
      profileQueryKeys.directory(),
    ],
    request: {
      path: '/profiles/me/studio',
      method: 'post',
    },
  })
}
