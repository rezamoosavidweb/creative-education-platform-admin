import { apiQueryKeys, useServerMutation } from '@/lib/query'
import { profileQueryKeys } from '../services/profiles-query'
import type { UpdateProfileRequest } from '../types'

export function useUpdateMyProfile() {
  return useServerMutation({
    invalidates: [
      apiQueryKeys.operation('/profiles/me', 'get'),
      profileQueryKeys.directory(),
    ],
    request: (body: UpdateProfileRequest) => ({
      path: '/profiles/me',
      method: 'patch',
      body,
    }),
  })
}
