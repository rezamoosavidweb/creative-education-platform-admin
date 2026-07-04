import { defineConfig } from 'orval'

export default defineConfig({
  adminApi: {
    input: {
      target: '../api/openapi.json',
      override: {
        transformer: stripUnsupportedValidationMetadata,
      },
    },
    output: {
      clean: true,
      client: 'react-query',
      httpClient: 'axios',
      mode: 'tags-split',
      schemas: 'src/lib/api/generated/model',
      target: 'src/lib/api/generated/endpoints',
      override: {
        mutator: {
          name: 'orvalApiClient',
          path: 'src/lib/api/orval-mutator.ts',
        },
        query: {
          signal: true,
          useMutation: true,
          useQuery: true,
          version: 5,
        },
      },
    },
  },
})

const UNSUPPORTED_VALIDATION_METADATA = new Set([
  'each',
  'int',
  'max',
  'min',
  'toLowerCase',
  'trimNewLines',
])

function stripUnsupportedValidationMetadata<T>(spec: T): T {
  return addMissingPathParameters(
    stripUnsupportedValidationMetadataValue(spec)
  ) as T
}

function stripUnsupportedValidationMetadataValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stripUnsupportedValidationMetadataValue)
  }

  if (!value || typeof value !== 'object') {
    return value
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !UNSUPPORTED_VALIDATION_METADATA.has(key))
      .map(([key, item]) => [key, stripUnsupportedValidationMetadataValue(item)])
  )
}

const HTTP_METHODS = new Set([
  'delete',
  'get',
  'head',
  'options',
  'patch',
  'post',
  'put',
  'trace',
])

function addMissingPathParameters(spec: unknown): unknown {
  if (!isRecord(spec) || !isRecord(spec.paths)) {
    return spec
  }

  const paths = Object.fromEntries(
    Object.entries(spec.paths).map(([path, pathItem]) => [
      path,
      addMissingPathParametersToPathItem(path, pathItem),
    ])
  )

  return {
    ...spec,
    paths,
  }
}

function addMissingPathParametersToPathItem(
  path: string,
  pathItem: unknown
): unknown {
  if (!isRecord(pathItem)) {
    return pathItem
  }

  const pathParamNames = readPathParamNames(path)
  if (pathParamNames.length === 0) {
    return pathItem
  }

  return Object.fromEntries(
    Object.entries(pathItem).map(([key, operation]) => [
      key,
      HTTP_METHODS.has(key)
        ? addMissingPathParametersToOperation(operation, pathParamNames)
        : operation,
    ])
  )
}

function addMissingPathParametersToOperation(
  operation: unknown,
  pathParamNames: readonly string[]
): unknown {
  if (!isRecord(operation)) {
    return operation
  }

  const existingParameters = Array.isArray(operation.parameters)
    ? operation.parameters
    : []
  const existingPathParamNames = new Set(
    existingParameters
      .filter(isRecord)
      .filter((parameter) => parameter.in === 'path')
      .map((parameter) => parameter.name)
      .filter((name): name is string => typeof name === 'string')
  )
  const missingParameters = pathParamNames
    .filter((name) => !existingPathParamNames.has(name))
    .map(createStringPathParameter)

  if (missingParameters.length === 0) {
    return operation
  }

  return {
    ...operation,
    parameters: [...existingParameters, ...missingParameters],
  }
}

function createStringPathParameter(name: string) {
  return {
    in: 'path',
    name,
    required: true,
    schema: {
      type: 'string',
    },
  }
}

function readPathParamNames(path: string): string[] {
  return Array.from(path.matchAll(/\{([^}]+)\}/g), ([, name]) => name)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}
