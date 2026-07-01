import { describe, expect, it } from 'vitest'
import {
  getActiveSessionItems,
  getActiveSessionsTableMeta,
  getReliableCurrentSessionId,
} from './sessions-query'

const sessionA = {
  id: 'session-a',
  createdAt: '2026-01-01T00:00:00.000Z',
  expiresAt: '2026-02-01T00:00:00.000Z',
}

const sessionB = {
  id: 'session-b',
  createdAt: '2026-01-02T00:00:00.000Z',
  expiresAt: '2026-02-02T00:00:00.000Z',
}

describe('session query helpers', () => {
  it('reads active sessions from the generated backend array response', () => {
    expect(getActiveSessionItems([sessionA])).toEqual([sessionA])
    expect(getActiveSessionItems(undefined)).toEqual([])
  })

  it('creates table metadata without client-side pagination', () => {
    expect(getActiveSessionsTableMeta([sessionA, sessionB])).toEqual({
      hasNextPage: false,
      hasPreviousPage: false,
      nextCursor: null,
      pageCount: 1,
      rowCount: 2,
    })
  })

  it('marks the current session only when the backend list is unambiguous', () => {
    expect(getReliableCurrentSessionId([sessionA])).toBe('session-a')
    expect(getReliableCurrentSessionId([sessionA, sessionB])).toBeNull()
    expect(getReliableCurrentSessionId([])).toBeNull()
  })
})
