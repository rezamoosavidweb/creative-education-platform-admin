import type { ApiMethod, ApiPath, ApiResponseBody } from '@/lib/api'
import {
  normalizePageResult,
  type PageItem,
  type ServerListResult,
} from './list-utils'
import { SERVER_LIST_STALE_TIME_MS } from './query-options'
import { useServerQuery, type UseServerQueryOptions } from './use-server-query'

export type UseServerListOptions<
  Path extends ApiPath,
  Method extends ApiMethod<Path>,
  Item = PageItem<ApiResponseBody<Path, Method>>,
> = Omit<
  UseServerQueryOptions<
    Path,
    Method,
    ServerListResult<Item, ApiResponseBody<Path, Method>>
  >,
  'select'
> & {
  getItems?: (raw: ApiResponseBody<Path, Method>) => Item[]
  getMeta?: (
    raw: ApiResponseBody<Path, Method>
  ) => ServerListResult<
    Item,
    ApiResponseBody<Path, Method>
  >['apiResult']['data'] extends never
    ? never
    :
        | import('@/lib/api/schema').components['schemas']['PageMetaDto']
        | undefined
}

export function useServerList<
  Path extends ApiPath,
  Method extends ApiMethod<Path>,
  Item = PageItem<ApiResponseBody<Path, Method>>,
>({
  getItems,
  getMeta,
  staleTime,
  ...options
}: UseServerListOptions<Path, Method, Item>) {
  return useServerQuery({
    ...options,
    select: (result) =>
      normalizePageResult<Item, ApiResponseBody<Path, Method>>({
        getItems,
        getMeta,
        result,
      }),
    staleTime: staleTime ?? SERVER_LIST_STALE_TIME_MS,
  })
}
