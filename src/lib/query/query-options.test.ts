import { describe, expect, it } from 'vitest'
import { ApiError } from '@/lib/api'
import { serverQueryRetry } from './query-options'

describe('server query retry policy', () => {
  it('does not retry canceled or authorization failures', () => {
    expect(
      serverQueryRetry(
        0,
        new ApiError({
          kind: 'canceled',
          message: 'Request canceled.',
          originalError: undefined,
        })
      )
    ).toBe(false)
    expect(
      serverQueryRetry(
        0,
        new ApiError({
          kind: 'http',
          message: 'Forbidden.',
          originalError: undefined,
          status: 403,
        })
      )
    ).toBe(false)
  })

  it('retries transient failures up to two times', () => {
    const error = new ApiError({
      kind: 'network',
      message: 'Network failed.',
      originalError: undefined,
    })

    expect(serverQueryRetry(0, error)).toBe(true)
    expect(serverQueryRetry(1, error)).toBe(true)
    expect(serverQueryRetry(2, error)).toBe(false)
  })
})
