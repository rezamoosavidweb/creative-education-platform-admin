import {
  useQuery,
  type QueryKey,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query'
import {
  apiRequest,
  type ApiError,
  type ApiMethod,
  type ApiPath,
  type ApiRequestOptions,
  type ApiResponseBody,
  type ApiResult,
} from '@/lib/api'
import { apiQueryKeys } from './query-keys'
import { SERVER_QUERY_STALE_TIME_MS, serverQueryRetry } from './query-options'

export type UseServerQueryOptions<
  Path extends ApiPath,
  Method extends ApiMethod<Path>,
  TData = ApiResult<ApiResponseBody<Path, Method>>,
> = Omit<
  UseQueryOptions<
    ApiResult<ApiResponseBody<Path, Method>>,
    ApiError,
    TData,
    QueryKey
  >,
  'queryFn' | 'queryKey'
> & {
  queryKey?: QueryKey
  request: ApiRequestOptions<Path, Method>
}

export function useServerQuery<
  Path extends ApiPath,
  Method extends ApiMethod<Path>,
  TData = ApiResult<ApiResponseBody<Path, Method>>,
>({
  queryKey,
  request,
  retry,
  staleTime,
  ...options
}: UseServerQueryOptions<Path, Method, TData>): UseQueryResult<
  TData,
  ApiError
> {
  return useQuery({
    ...options,
    queryFn: ({ signal }) =>
      apiRequest({
        ...request,
        signal: request.signal ?? signal,
      }),
    queryKey: queryKey ?? apiQueryKeys.request(request),
    retry: retry ?? serverQueryRetry,
    staleTime: staleTime ?? SERVER_QUERY_STALE_TIME_MS,
  })
}
