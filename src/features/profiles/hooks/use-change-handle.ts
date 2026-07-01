import { apiQueryKeys, useServerMutation } from '@/lib/query'
import { profileQueryKeys } from '../services/profiles-query'
import type { ChangeHandleRequest } from '../types'

export function useChangeHandle() {
  return useServerMutation({
    invalidates: [
      apiQueryKeys.operation('/profiles/me', 'get'),
      profileQueryKeys.directory(),
    ],
    request: (body: ChangeHandleRequest) => ({
      path: '/profiles/me/handle',
      method: 'patch',
      body,
    }),
  })
}
