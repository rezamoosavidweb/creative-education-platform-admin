import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'
import { getApiErrorMessage, toApiError } from '@/lib/api'

export type ApiFormTranslator = (message: string) => string

export type ApiFieldError = {
  field: string | null
  message: string
}

export type ApplyApiValidationOptions<TFieldValues extends FieldValues> = {
  fieldAliases?: Partial<Record<string, FieldPath<TFieldValues>>>
  rootName?: `root.${string}` | 'root'
  translate?: ApiFormTranslator
}

export function readApiValidationErrors(error: unknown): ApiFieldError[] {
  const apiError = toApiError(error)
  const body = apiError.body

  return [
    ...readRecordErrors(readNestedRecord(body, 'errors')),
    ...readRecordErrors(readNestedRecord(body, 'fieldErrors')),
    ...readViolationErrors(body),
    ...readMessageArrayErrors(body),
  ]
}

export function applyApiValidationErrors<TFieldValues extends FieldValues>(
  form: Pick<UseFormReturn<TFieldValues>, 'setError'>,
  error: unknown,
  options: ApplyApiValidationOptions<TFieldValues> = {}
): void {
  const validationErrors = readApiValidationErrors(error)
  const rootName = options.rootName ?? 'root.server'

  if (validationErrors.length === 0) {
    form.setError(rootName, {
      message: localizeApiFormMessage(getApiErrorMessage(error), options),
      type: 'server',
    })
    return
  }

  for (const validationError of validationErrors) {
    const fieldName = resolveFieldName(validationError.field, options)
    form.setError(fieldName ?? rootName, {
      message: localizeApiFormMessage(validationError.message, options),
      type: 'server',
    })
  }
}

export function localizeApiFormMessage(
  message: string,
  options: Pick<ApplyApiValidationOptions<FieldValues>, 'translate'> = {}
): string {
  return options.translate?.(message) ?? message
}

function readNestedRecord(
  body: unknown,
  key: 'errors' | 'fieldErrors'
): Record<string, unknown> | null {
  if (!body || typeof body !== 'object') return null
  const value = (body as Record<string, unknown>)[key]
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

function readRecordErrors(
  errors: Record<string, unknown> | null
): ApiFieldError[] {
  if (!errors) return []

  return Object.entries(errors).flatMap(([field, value]) => {
    const messages = Array.isArray(value) ? value : [value]
    return messages
      .filter((message): message is string => typeof message === 'string')
      .map((message) => ({ field, message }))
  })
}

function readViolationErrors(body: unknown): ApiFieldError[] {
  if (!body || typeof body !== 'object') return []
  const violations = (body as Record<string, unknown>).violations
  if (!Array.isArray(violations)) return []

  return violations.flatMap((violation) => {
    if (!violation || typeof violation !== 'object') return []
    const record = violation as Record<string, unknown>
    const message = record.message
    if (typeof message !== 'string') return []

    const field = record.field ?? record.property ?? record.path
    return [
      {
        field: typeof field === 'string' ? field : null,
        message,
      },
    ]
  })
}

function readMessageArrayErrors(body: unknown): ApiFieldError[] {
  if (!body || typeof body !== 'object') return []
  const message = (body as Record<string, unknown>).message
  if (!Array.isArray(message)) return []

  return message
    .filter((item): item is string => typeof item === 'string')
    .map((item) => ({
      field: null,
      message: item,
    }))
}

function resolveFieldName<TFieldValues extends FieldValues>(
  field: string | null,
  options: ApplyApiValidationOptions<TFieldValues>
): FieldPath<TFieldValues> | null {
  if (!field) return null
  return options.fieldAliases?.[field] ?? (field as FieldPath<TFieldValues>)
}
