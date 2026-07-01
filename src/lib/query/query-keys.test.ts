import { describe, expect, it } from 'vitest'
import { buildApiQueryKey, createQueryKey } from './query-keys'

describe('query key helpers', () => {
  it('builds stable api request keys from OpenAPI request options', () => {
    expect(
      buildApiQueryKey({
        method: 'get',
        path: '/users/{id}',
        pathParams: { id: 'user-1' },
        query: undefined,
        signal: new AbortController().signal,
      })
    ).toEqual(['api', 'get', '/users/{id}', { pathParams: { id: 'user-1' } }])
  })

  it('sorts object keys and removes undefined values', () => {
    expect(
      createQueryKey('users', {
        b: 1,
        a: undefined,
        c: { z: 'last', y: undefined, x: 'first' },
      })
    ).toEqual(['users', { b: 1, c: { x: 'first', z: 'last' } }])
  })
})
