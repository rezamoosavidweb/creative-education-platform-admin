import { apiQueryKeys, useServerMutation } from '@/lib/query'
import { profileQueryKeys } from '../services/profiles-query'

export function useEnsurePractitionerProfile() {
  return useServerMutation({
    invalidates: [
      apiQueryKeys.operation('/profiles/me/practitioner', 'get'),
      profileQueryKeys.directory(),
    ],
    request: {
      path: '/profiles/me/practitioner',
      method: 'post',
    },
  })
}
