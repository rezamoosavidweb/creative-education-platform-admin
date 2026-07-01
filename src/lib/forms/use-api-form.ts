import { useCallback } from 'react'
import {
  useForm,
  type FieldValues,
  type SubmitHandler,
  type UseFormProps,
} from 'react-hook-form'
import {
  applyApiValidationErrors,
  type ApplyApiValidationOptions,
} from './api-validation'

type ApiFormSubmitOptions<TFieldValues extends FieldValues> =
  ApplyApiValidationOptions<TFieldValues> & {
    onError?: (error: unknown) => void
    rethrow?: boolean
  }

export function useApiForm<TFieldValues extends FieldValues>(
  props: UseFormProps<TFieldValues>
) {
  const form = useForm<TFieldValues>(props)

  const applyServerErrors = useCallback(
    (error: unknown, options?: ApplyApiValidationOptions<TFieldValues>) => {
      applyApiValidationErrors(form, error, options)
    },
    [form]
  )

  const handleApiSubmit = useCallback(
    (
      submit: SubmitHandler<TFieldValues>,
      options: ApiFormSubmitOptions<TFieldValues> = {}
    ) =>
      form.handleSubmit(async (values, event) => {
        try {
          await submit(values, event)
        } catch (error) {
          applyApiValidationErrors(form, error, options)
          options.onError?.(error)
          if (options.rethrow) throw error
        }
      }),
    [form]
  )

  return {
    applyServerErrors,
    form,
    handleApiSubmit,
  }
}
