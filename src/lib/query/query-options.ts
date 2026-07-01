import type { QueryKey } from '@tanstack/react-query'
import type { ApiError } from '@/lib/api'

export const SERVER_QUERY_STALE_TIME_MS = 30_000
export const SERVER_LIST_STALE_TIME_MS = 15_000

export function serverQueryRetry(
  failureCount: number,
  error: ApiError
): boolean {
  if (error.kind === 'canceled') return false
  if ([400, 401, 403, 404, 422].includes(error.status ?? 0)) return false
  return failureCount < 2
}

export type InvalidateTarget =
  | QueryKey
  | {
      exact?: boolean
      queryKey: QueryKey
    }
