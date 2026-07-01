import type { AxiosRequestConfig } from 'axios'
import type { paths } from './schema'

export type ApiPath = keyof paths

export type ApiHttpMethod =
  | 'get'
  | 'put'
  | 'post'
  | 'delete'
  | 'options'
  | 'head'
  | 'patch'
  | 'trace'

export type ApiMethod<Path extends ApiPath> = {
  [Method in ApiHttpMethod]: paths[Path][Method] extends never | undefined
    ? never
    : Method
}[ApiHttpMethod]

export type ApiOperation<
  Path extends ApiPath,
  Method extends ApiMethod<Path>,
> = paths[Path][Method]

type JsonContent<Content> = Content extends { 'application/json': infer Data }
  ? Data
  : Content extends { 'multipart/form-data': infer Data }
    ? Data
    : Content extends { 'text/plain': infer Data }
      ? Data
      : Content extends { 'application/octet-stream': infer Data }
        ? Data
        : never

type OperationParameters<Operation> = Operation extends {
  parameters: infer Parameters
}
  ? Parameters
  : never

export type ApiPathParams<
  Path extends ApiPath,
  Method extends ApiMethod<Path>,
> =
  OperationParameters<ApiOperation<Path, Method>> extends {
    path: infer Params
  }
    ? Params
    : PathTemplateParams<Path>

export type ApiQueryParams<
  Path extends ApiPath,
  Method extends ApiMethod<Path>,
> =
  OperationParameters<ApiOperation<Path, Method>> extends {
    query?: infer Params
  }
    ? Params
    : never

export type ApiRequestBody<
  Path extends ApiPath,
  Method extends ApiMethod<Path>,
> =
  ApiOperation<Path, Method> extends {
    requestBody: { content: infer Content }
  }
    ? JsonContent<Content>
    : never

type SuccessStatus = 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226

type OperationResponses<Operation> = Operation extends {
  responses: infer Responses
}
  ? Responses
  : never

type SuccessResponse<Responses> = {
  [Status in keyof Responses]: Status extends SuccessStatus
    ? Responses[Status]
    : never
}[keyof Responses]

type ResponseBody<Response> = Response extends {
  content: infer Content
}
  ? JsonContent<Content>
  : never

export type ApiResponseBody<
  Path extends ApiPath,
  Method extends ApiMethod<Path>,
> =
  ResponseBody<
    SuccessResponse<OperationResponses<ApiOperation<Path, Method>>>
  > extends never
    ? void
    : ResponseBody<
        SuccessResponse<OperationResponses<ApiOperation<Path, Method>>>
      >

type ErrorResponse<Responses> = {
  [Status in keyof Responses]: Status extends SuccessStatus
    ? never
    : Responses[Status]
}[keyof Responses]

export type ApiErrorBody<
  Path extends ApiPath,
  Method extends ApiMethod<Path>,
> = ResponseBody<ErrorResponse<OperationResponses<ApiOperation<Path, Method>>>>

type MaybePathParams<Path extends ApiPath, Method extends ApiMethod<Path>> = [
  ApiPathParams<Path, Method>,
] extends [never]
  ? { pathParams?: never }
  : { pathParams: ApiPathParams<Path, Method> }

type MaybeQueryParams<Path extends ApiPath, Method extends ApiMethod<Path>> = [
  ApiQueryParams<Path, Method>,
] extends [never]
  ? { query?: never }
  : { query?: ApiQueryParams<Path, Method> }

type MaybeRequestBody<Path extends ApiPath, Method extends ApiMethod<Path>> = [
  ApiRequestBody<Path, Method>,
] extends [never]
  ? { body?: never }
  : { body: ApiRequestBody<Path, Method> }

export type ApiRequestOptions<
  Path extends ApiPath,
  Method extends ApiMethod<Path>,
> = {
  path: Path
  method: Method
  headers?: Record<string, string>
  idempotencyKey?: string
  signal?: AbortSignal
  timeoutMs?: number
  responseType?: AxiosRequestConfig['responseType']
  skipAuthHeader?: boolean
  skipAuthRetry?: boolean
} & MaybePathParams<Path, Method> &
  MaybeQueryParams<Path, Method> &
  MaybeRequestBody<Path, Method>

export type ApiResult<Data> = {
  data: Data
  status: number
  headers: Record<string, unknown>
  nextCursor: string | null
}

type PathTemplateParamKeys<Path extends string> =
  Path extends `${string}{${infer Param}}${infer Rest}`
    ? Param | PathTemplateParamKeys<Rest>
    : never

type PathTemplateParams<Path extends string> = [
  PathTemplateParamKeys<Path>,
] extends [never]
  ? never
  : Record<PathTemplateParamKeys<Path>, string | number>
