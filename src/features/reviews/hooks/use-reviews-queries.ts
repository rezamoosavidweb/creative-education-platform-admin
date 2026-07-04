import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  reputationControllerGet,
  reviewControllerEdit,
  reviewControllerList,
  reviewControllerListMine,
  reviewControllerRemove,
  reviewControllerSubmit,
} from '@/lib/api/generated/endpoints/reviews/reviews'
import type {
  EditReviewRequest,
  ReviewSubject,
  SubmitReviewRequest,
} from '../types'

export const reviewsQueryKeys = {
  all: ['reviews'] as const,
  mine: () => ['reviews', 'mine'] as const,
  reputation: (subject: ReviewSubject | null) =>
    [
      'reviews',
      'reputation',
      subject?.subjectType,
      subject?.subjectId,
    ] as const,
  subject: (subject: ReviewSubject | null) =>
    ['reviews', 'subject', subject?.subjectType, subject?.subjectId] as const,
}

export function useMyReviews() {
  return useQuery({
    queryFn: ({ signal }) => reviewControllerListMine(undefined, signal),
    queryKey: reviewsQueryKeys.mine(),
  })
}

export function useSubjectReviews(subject: ReviewSubject | null) {
  return useQuery({
    enabled: Boolean(subject),
    queryFn: ({ signal }) => reviewControllerList(subject!, undefined, signal),
    queryKey: reviewsQueryKeys.subject(subject),
  })
}

export function useSubjectReputation(subject: ReviewSubject | null) {
  return useQuery({
    enabled: Boolean(subject),
    queryFn: ({ signal }) =>
      reputationControllerGet(subject!, undefined, signal),
    queryKey: reviewsQueryKeys.reputation(subject),
  })
}

function useReviewsInvalidation() {
  const queryClient = useQueryClient()

  return async () => {
    await queryClient.invalidateQueries({ queryKey: reviewsQueryKeys.all })
  }
}

export function useSubmitReview() {
  const invalidate = useReviewsInvalidation()

  return useMutation({
    mutationFn: (body: SubmitReviewRequest) => reviewControllerSubmit(body),
    onSuccess: invalidate,
  })
}

export function useEditReview() {
  const invalidate = useReviewsInvalidation()

  return useMutation({
    mutationFn: ({ body, id }: { body: EditReviewRequest; id: string }) =>
      reviewControllerEdit(id, body),
    onSuccess: invalidate,
  })
}

export function useRemoveReview() {
  const invalidate = useReviewsInvalidation()

  return useMutation({
    mutationFn: (id: string) => reviewControllerRemove(id),
    onSuccess: invalidate,
  })
}
