import { describe, expect, it } from 'vitest'
import { normalizeCursorResult, normalizePageResult } from './list-utils'

describe('server list normalizers', () => {
  it('normalizes backend PageDto responses', () => {
    const normalized = normalizePageResult<{ id: string }, unknown>({
      result: {
        data: {
          data: [{ id: 'user-1' }],
          meta: {
            hasNextPage: true,
            hasPreviousPage: false,
            itemCount: 11,
            page: 1,
            pageCount: 2,
            take: 10,
          },
        },
        headers: {},
        nextCursor: null,
        status: 200,
      },
    })

    expect(normalized).toMatchObject({
      hasNextPage: true,
      hasPreviousPage: false,
      items: [{ id: 'user-1' }],
      page: 1,
      pageCount: 2,
      pageSize: 10,
      total: 11,
    })
  })

  it('normalizes cursor responses and X-Next-Cursor metadata', () => {
    const normalized = normalizeCursorResult<{ id: string }, unknown>({
      result: {
        data: {
          items: [{ id: 'result-1' }],
          total: 25,
        },
        headers: { 'x-next-cursor': 'cursor-2' },
        nextCursor: 'cursor-2',
        status: 200,
      },
    })

    expect(normalized).toMatchObject({
      hasNextPage: true,
      items: [{ id: 'result-1' }],
      nextCursor: 'cursor-2',
      total: 25,
    })
  })
})
