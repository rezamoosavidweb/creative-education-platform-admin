import type {
  EditReviewDto,
  ReputationDto,
  ReviewControllerListParams,
  ReviewDto,
  ReviewStatus,
  SubjectType,
  SubmitReviewDto,
} from '@/lib/api/generated/model'

export type Review = ReviewDto
export type Reputation = ReputationDto
export type ReviewSubject = ReviewControllerListParams
export type ReviewStatusValue = ReviewStatus
export type ReviewSubjectType = SubjectType
export type SubmitReviewRequest = SubmitReviewDto
export type EditReviewRequest = EditReviewDto
