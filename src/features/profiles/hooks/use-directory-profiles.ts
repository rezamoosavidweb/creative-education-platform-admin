import { useServerQuery } from '@/lib/query'
import {
  normalizeDirectoryQuery,
  profileQueryKeys,
} from '../services/profiles-query'
import type { DirectoryQuery } from '../types'

export function useDirectoryProfiles(query?: DirectoryQuery) {
  const normalizedQuery = normalizeDirectoryQuery(query)

  return useServerQuery({
    queryKey: profileQueryKeys.directoryQuery(normalizedQuery),
    request: {
      path: '/directory',
      method: 'get',
      query: normalizedQuery,
    },
  })
}
