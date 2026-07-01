import { useCallback } from 'react'
import { useQueryClient, type QueryKey } from '@tanstack/react-query'
import type { InvalidateTarget } from './query-options'

export function useInvalidate() {
  const queryClient = useQueryClient()

  return useCallback(
    async (...targets: readonly InvalidateTarget[]) => {
      await Promise.all(
        targets.map((target) => {
          const options = normalizeInvalidateTarget(target)
          return queryClient.invalidateQueries(options)
        })
      )
    },
    [queryClient]
  )
}

export function normalizeInvalidateTarget(target: InvalidateTarget): {
  exact?: boolean
  queryKey: QueryKey
} {
  return isQueryKey(target) ? { queryKey: target } : target
}

function isQueryKey(target: InvalidateTarget): target is QueryKey {
  return Array.isArray(target)
}
