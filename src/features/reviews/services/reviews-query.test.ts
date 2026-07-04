import { describe, expect, it } from 'vitest'
import {
  filterReviews,
  formatRating,
  formatSubjectLabel,
  getReviewStatusTone,
  REVIEW_SUBJECT_TYPES,
} from './reviews-query'

describe('reviews-query', () => {
  it('uses generated subject types and maps status tones', () => {
    expect(REVIEW_SUBJECT_TYPES).toContain('COURSE')
    expect(getReviewStatusTone('PUBLISHED')).toBe('ok')
    expect(getReviewStatusTone('REMOVED')).toBe('neutral')
  })

  it('formats ratings, subject labels, and filters reviews', () => {
    const review = {
      authorUserId: 'author-1',
      body: 'Thoughtful session',
      createdAt: '2026-01-01T00:00:00.000Z',
      id: 'review-1',
      rating: 4,
      status: 'PUBLISHED' as const,
      subjectId: 'subject-1',
      subjectType: 'EVENT' as const,
      updatedAt: '2026-01-01T00:00:00.000Z',
    }

    expect(formatRating(4)).toBe('4.0 / 5')
    expect(formatSubjectLabel(review)).toBe('EVENT subject-1')
    expect(filterReviews([review], 'session')).toEqual([review])
    expect(filterReviews([review], 'missing')).toEqual([])
  })
})
