import { SubjectType } from '@/lib/api/generated/model'
import type { PillTone } from '@/components/status-pill'
import type { Review, ReviewStatusValue, ReviewSubjectType } from '../types'

export const REVIEW_SUBJECT_TYPES = Object.values(SubjectType)

export function getReviewStatusTone(status: ReviewStatusValue): PillTone {
  switch (status) {
    case 'PUBLISHED':
      return 'ok'
    case 'REMOVED':
    default:
      return 'neutral'
  }
}

export function formatRating(rating: number): string {
  return `${rating.toFixed(1)} / 5`
}

export function formatSubjectLabel({
  subjectId,
  subjectType,
}: {
  subjectId: string
  subjectType: ReviewSubjectType
}): string {
  return `${subjectType} ${subjectId}`
}

export function filterReviews(reviews: Review[], query: string): Review[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return reviews

  return reviews.filter((review) =>
    [
      review.subjectType,
      review.subjectId,
      review.authorUserId,
      review.status,
      review.body,
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(normalized))
  )
}
