import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { describe, expect, it } from 'vitest'
import { ApiError, getApiErrorMessage, isApiError, toApiError } from './errors'

describe('api error mapping', () => {
  it('preserves existing ApiError instances', () => {
    const error = new ApiError({
      kind: 'http',
      message: 'Already mapped',
      originalError: undefined,
      status: 400,
    })

    expect(toApiError(error)).toBe(error)
    expect(isApiError(error)).toBe(true)
  })

  it('maps no-content status objects', () => {
    expect(getApiErrorMessage({ status: 204 })).toBe('No content.')
  })

  it('prefers title, message, then error values from response bodies', () => {
    const error = new AxiosError('Bad request')
    const config = {
      headers: new AxiosHeaders(),
    } as InternalAxiosRequestConfig
    error.response = {
      config,
      data: { message: ['First validation error'] },
      headers: {},
      status: 422,
      statusText: 'Unprocessable Entity',
    }

    expect(getApiErrorMessage(error)).toBe('First validation error')
  })

  it('maps timeout and canceled axios errors', () => {
    const timeout = new AxiosError('timeout', AxiosError.ECONNABORTED)
    const canceled = new AxiosError('canceled', AxiosError.ERR_CANCELED)

    expect(toApiError(timeout)).toMatchObject({
      kind: 'timeout',
      message: 'Request timed out.',
    })
    expect(toApiError(canceled)).toMatchObject({
      kind: 'canceled',
      message: 'Request canceled.',
    })
  })
})
