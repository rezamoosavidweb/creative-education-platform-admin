import { apiQueryKeys, useServerMutation } from '@/lib/query'
import { profileQueryKeys } from '../services/profiles-query'
import type { UpdateInstructorRequest } from '../types'

export function useUpdateInstructorProfile() {
  return useServerMutation({
    invalidates: [
      apiQueryKeys.operation('/profiles/me/instructor', 'get'),
      profileQueryKeys.directory(),
    ],
    request: (body: UpdateInstructorRequest) => ({
      path: '/profiles/me/instructor',
      method: 'patch',
      body,
    }),
  })
}
