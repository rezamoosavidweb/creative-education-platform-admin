import { apiQueryKeys, useServerMutation } from '@/lib/query'
import { profileQueryKeys } from '../services/profiles-query'
import type { UpdateStudioRequest } from '../types'

export function useUpdateStudioProfile() {
  return useServerMutation({
    invalidates: [
      apiQueryKeys.operation('/profiles/me/studio', 'get'),
      profileQueryKeys.directory(),
    ],
    request: (body: UpdateStudioRequest) => ({
      path: '/profiles/me/studio',
      method: 'patch',
      body,
    }),
  })
}
