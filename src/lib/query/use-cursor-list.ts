import type { ApiMethod, ApiPath, ApiResponseBody, ApiResult } from '@/lib/api'
import {
  normalizeCursorResult,
  type CursorItem,
  type CursorListResult,
} from './list-utils'
import { SERVER_LIST_STALE_TIME_MS } from './query-options'
import { useServerQuery, type UseServerQueryOptions } from './use-server-query'

export type UseCursorListOptions<
  Path extends ApiPath,
  Method extends ApiMethod<Path>,
  Item = CursorItem<ApiResponseBody<Path, Method>>,
> = Omit<
  UseServerQueryOptions<
    Path,
    Method,
    CursorListResult<Item, ApiResponseBody<Path, Method>>
  >,
  'select'
> & {
  getItems?: (raw: ApiResponseBody<Path, Method>) => Item[]
  getNextCursor?: (
    raw: ApiResponseBody<Path, Method>,
    result: ApiResult<ApiResponseBody<Path, Method>>
  ) => string | null
  getTotal?: (raw: ApiResponseBody<Path, Method>) => number | undefined
}

export function useCursorList<
  Path extends ApiPath,
  Method extends ApiMethod<Path>,
  Item = CursorItem<ApiResponseBody<Path, Method>>,
>({
  getItems,
  getNextCursor,
  getTotal,
  staleTime,
  ...options
}: UseCursorListOptions<Path, Method, Item>) {
  return useServerQuery({
    ...options,
    select: (result) =>
      normalizeCursorResult<Item, ApiResponseBody<Path, Method>>({
        getItems,
        getNextCursor,
        getTotal,
        result,
      }),
    staleTime: staleTime ?? SERVER_LIST_STALE_TIME_MS,
  })
}
