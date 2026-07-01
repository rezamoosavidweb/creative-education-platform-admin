import { apiQueryKeys, useServerMutation } from '@/lib/query'
import { profileQueryKeys } from '../services/profiles-query'

export function useUnpublishProfile() {
  return useServerMutation({
    invalidates: [
      apiQueryKeys.operation('/profiles/me', 'get'),
      profileQueryKeys.directory(),
    ],
    request: {
      path: '/profiles/me/unpublish',
      method: 'post',
    },
  })
}
