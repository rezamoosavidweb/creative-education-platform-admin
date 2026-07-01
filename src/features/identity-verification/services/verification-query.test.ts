import { describe, expect, it } from 'vitest'
import {
  getVerificationQueueItems,
  getVerificationQueueMeta,
  getVerificationStatusTone,
} from './verification-query'
import type { ProfileVerification } from '../types'

const verification: ProfileVerification = {
  id: 'verification-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
  userId: 'user-1',
  profileType: 'INSTRUCTOR',
  status: 'PENDING',
  evidence: 'Portfolio URL',
  reviewNote: null,
}

describe('verification query helpers', () => {
  it('reads queue items from the generated backend array response', () => {
    expect(getVerificationQueueItems([verification])).toEqual([verification])
    expect(getVerificationQueueItems(undefined)).toEqual([])
  })

  it('creates table metadata without client-side pagination', () => {
    expect(getVerificationQueueMeta([verification])).toEqual({
      hasNextPage: false,
      hasPreviousPage: false,
      nextCursor: null,
      pageCount: 1,
      rowCount: 1,
    })
  })

  it('maps generated verification statuses to existing status tones', () => {
    expect(getVerificationStatusTone('VERIFIED')).toBe('ok')
    expect(getVerificationStatusTone('PENDING')).toBe('warn')
    expect(getVerificationStatusTone('REJECTED')).toBe('err')
    expect(getVerificationStatusTone('UNVERIFIED')).toBe('neutral')
  })
})
