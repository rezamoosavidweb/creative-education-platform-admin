import type { UseFormReturn } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/lib/api'
import {
  applyApiValidationErrors,
  localizeApiFormMessage,
  readApiValidationErrors,
} from './api-validation'

type FormValues = {
  email: string
  password: string
}

describe('api form validation helpers', () => {
  it('reads field errors from common server validation shapes', () => {
    expect(
      readApiValidationErrors(
        new ApiError({
          body: {
            errors: {
              email: ['Invalid email.'],
              password: 'Too short.',
            },
          },
          kind: 'http',
          message: 'Validation failed.',
          originalError: undefined,
          status: 422,
        })
      )
    ).toEqual([
      { field: 'email', message: 'Invalid email.' },
      { field: 'password', message: 'Too short.' },
    ])

    expect(
      readApiValidationErrors(
        new ApiError({
          body: {
            violations: [{ field: 'email', message: 'Already used.' }],
          },
          kind: 'http',
          message: 'Validation failed.',
          originalError: undefined,
          status: 422,
        })
      )
    ).toEqual([{ field: 'email', message: 'Already used.' }])
  })

  it('applies field and root server errors to react-hook-form', () => {
    const setError = vi.fn()
    const form = { setError } as unknown as Pick<
      UseFormReturn<FormValues>,
      'setError'
    >

    applyApiValidationErrors(
      form,
      new ApiError({
        body: {
          errors: {
            emailAddress: 'Invalid email.',
          },
          message: ['Global issue.'],
        },
        kind: 'http',
        message: 'Validation failed.',
        originalError: undefined,
        status: 422,
      }),
      {
        fieldAliases: {
          emailAddress: 'email',
        },
      }
    )

    expect(setError).toHaveBeenCalledWith('email', {
      message: 'Invalid email.',
      type: 'server',
    })
    expect(setError).toHaveBeenCalledWith('root.server', {
      message: 'Global issue.',
      type: 'server',
    })
  })

  it('falls back to ApiError message when no field details exist', () => {
    const setError = vi.fn()

    applyApiValidationErrors(
      { setError },
      new ApiError({
        kind: 'http',
        message: 'Forbidden.',
        originalError: undefined,
        status: 403,
      })
    )

    expect(setError).toHaveBeenCalledWith('root.server', {
      message: 'Forbidden.',
      type: 'server',
    })
  })

  it('localizes server messages through the provided translator', () => {
    expect(
      localizeApiFormMessage('Invalid email.', {
        translate: (message) => `Translated: ${message}`,
      })
    ).toBe('Translated: Invalid email.')
  })
})
