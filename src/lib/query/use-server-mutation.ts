import {
  useMutation,
  useQueryClient,
  type MutationKey,
  type QueryClient,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query'
import type {
  ApiError,
  ApiMethod,
  ApiPath,
  ApiRequestOptions,
  ApiResponseBody,
  ApiResult,
} from '@/lib/api'
import type { InvalidateTarget } from './query-options'
import { useApi } from './use-api'
import { normalizeInvalidateTarget } from './use-invalidate'

type ServerMutationRequest<
  Path extends ApiPath,
  Method extends ApiMethod<Path>,
  TVariables,
> =
  | ApiRequestOptions<Path, Method>
  | ((variables: TVariables) => ApiRequestOptions<Path, Method>)

type ServerMutationInvalidation<
  Path extends ApiPath,
  Method extends ApiMethod<Path>,
  TVariables,
> =
  | readonly InvalidateTarget[]
  | ((
      data: ApiResult<ApiResponseBody<Path, Method>>,
      variables: TVariables
    ) => readonly InvalidateTarget[])

type OptimisticMutationContext<TVariables, TContext> = {
  queryClient: QueryClient
  variables: TVariables
  context: TContext
}

export type UseServerMutationOptions<
  Path extends ApiPath,
  Method extends ApiMethod<Path>,
  TVariables = void,
  TContext = unknown,
> = Omit<
  UseMutationOptions<
    ApiResult<ApiResponseBody<Path, Method>>,
    ApiError,
    TVariables,
    TContext
  >,
  'mutationFn' | 'mutationKey' | 'onError' | 'onMutate' | 'onSuccess'
> & {
  invalidates?: ServerMutationInvalidation<Path, Method, TVariables>
  mutationKey?: MutationKey
  optimisticUpdate?: (
    context: Pick<
      OptimisticMutationContext<TVariables, TContext>,
      'queryClient' | 'variables'
    >
  ) => Promise<TContext> | TContext
  request: ServerMutationRequest<Path, Method, TVariables>
  rollback?: (
    context: OptimisticMutationContext<TVariables, TContext> & {
      error: ApiError
    }
  ) => void
  onError?: (
    error: ApiError,
    variables: TVariables,
    context: TContext | undefined
  ) => void
  onMutate?: (variables: TVariables) => Promise<TContext> | TContext
  onSuccess?: (
    data: ApiResult<ApiResponseBody<Path, Method>>,
    variables: TVariables,
    context: TContext | undefined
  ) => Promise<void> | void
}

export function useServerMutation<
  Path extends ApiPath,
  Method extends ApiMethod<Path>,
  TVariables = void,
  TContext = unknown,
>({
  invalidates = [],
  mutationKey,
  onError,
  onMutate,
  onSuccess,
  optimisticUpdate,
  request,
  rollback,
  ...options
}: UseServerMutationOptions<
  Path,
  Method,
  TVariables,
  TContext
>): UseMutationResult<
  ApiResult<ApiResponseBody<Path, Method>>,
  ApiError,
  TVariables,
  TContext
> {
  const api = useApi()
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationKey,
    mutationFn: (variables) =>
      api.request(resolveMutationRequest(request, variables)),
    onMutate: async (variables) => {
      const optimisticContext = await optimisticUpdate?.({
        queryClient,
        variables,
      })
      const userContext = await onMutate?.(variables)
      return (optimisticContext ?? userContext) as TContext
    },
    onError: (error, variables, context) => {
      if (rollback && context !== undefined) {
        rollback({
          context,
          error,
          queryClient,
          variables,
        })
      }
      onError?.(error, variables, context)
    },
    onSuccess: async (data, variables, context) => {
      await invalidateTargets(
        queryClient,
        resolveInvalidates(invalidates, data, variables)
      )
      await onSuccess?.(data, variables, context)
    },
  })
}

function resolveMutationRequest<
  Path extends ApiPath,
  Method extends ApiMethod<Path>,
  TVariables,
>(
  request: ServerMutationRequest<Path, Method, TVariables>,
  variables: TVariables
): ApiRequestOptions<Path, Method> {
  return typeof request === 'function' ? request(variables) : request
}

function resolveInvalidates<
  Path extends ApiPath,
  Method extends ApiMethod<Path>,
  TVariables,
>(
  invalidates: ServerMutationInvalidation<Path, Method, TVariables>,
  data: ApiResult<ApiResponseBody<Path, Method>>,
  variables: TVariables
): readonly InvalidateTarget[] {
  return typeof invalidates === 'function'
    ? invalidates(data, variables)
    : invalidates
}

async function invalidateTargets(
  queryClient: QueryClient,
  targets: readonly InvalidateTarget[]
): Promise<void> {
  await Promise.all(
    targets.map((target) =>
      queryClient.invalidateQueries(normalizeInvalidateTarget(target))
    )
  )
}
