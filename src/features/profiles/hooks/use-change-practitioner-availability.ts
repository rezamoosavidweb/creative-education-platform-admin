import { apiQueryKeys, useServerMutation } from '@/lib/query'
import { profileQueryKeys } from '../services/profiles-query'
import type { ChangeAvailabilityRequest } from '../types'

export function useChangePractitionerAvailability() {
  return useServerMutation({
    invalidates: [
      apiQueryKeys.operation('/profiles/me/practitioner', 'get'),
      profileQueryKeys.directory(),
    ],
    request: (body: ChangeAvailabilityRequest) => ({
      path: '/profiles/me/practitioner/availability',
      method: 'patch',
      body,
    }),
  })
}
