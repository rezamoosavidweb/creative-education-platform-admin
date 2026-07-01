import type { QueryKey } from '@tanstack/react-query'
import type { ApiMethod, ApiPath, ApiRequestOptions } from '@/lib/api'

export const apiQueryKeys = {
  all: ['api'] as const,
  path: <Path extends ApiPath>(path: Path) => ['api', path] as const,
  operation: <Path extends ApiPath, Method extends ApiMethod<Path>>(
    path: Path,
    method: Method
  ) => ['api', method, path] as const,
  request: <Path extends ApiPath, Method extends ApiMethod<Path>>(
    request: ApiRequestOptions<Path, Method>
  ) => buildApiQueryKey(request),
}

export function createQueryKey(
  namespace: string,
  ...parts: readonly unknown[]
): QueryKey {
  return sanitizeQueryKeyPart([namespace, ...parts]) as QueryKey
}

export function buildApiQueryKey<
  Path extends ApiPath,
  Method extends ApiMethod<Path>,
>(request: ApiRequestOptions<Path, Method>): QueryKey {
  return createQueryKey('api', request.method, request.path, {
    body: 'body' in request ? request.body : undefined,
    pathParams: 'pathParams' in request ? request.pathParams : undefined,
    query: 'query' in request ? request.query : undefined,
  })
}

function sanitizeQueryKeyPart(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sanitizeQueryKeyPart)
  }

  if (!value || typeof value !== 'object') return value

  const entries = Object.entries(value)
    .filter(([, entryValue]) => entryValue !== undefined)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, entryValue]) => [key, sanitizeQueryKeyPart(entryValue)])

  return Object.fromEntries(entries)
}
