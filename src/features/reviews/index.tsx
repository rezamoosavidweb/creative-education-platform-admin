import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ApiEmpty, ApiQueryState } from '@/components/api'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { StatCard } from '@/components/stat-card'
import { ReviewFormDialog } from './components/review-form-dialog'
import { ReviewsTable } from './components/reviews-table'
import {
  useMyReviews,
  useRemoveReview,
  useSubjectReputation,
  useSubjectReviews,
} from './hooks/use-reviews-queries'
import {
  filterReviews,
  formatRating,
  REVIEW_SUBJECT_TYPES,
} from './services/reviews-query'
import type { Review, ReviewSubject, ReviewSubjectType } from './types'

export function Reviews() {
  const [query, setQuery] = useState('')
  const [subjectType, setSubjectType] = useState<ReviewSubjectType>('COURSE')
  const [subjectId, setSubjectId] = useState('')
  const [subject, setSubject] = useState<ReviewSubject | null>(null)
  const [reviewFormOpen, setReviewFormOpen] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)

  const myReviewsQuery = useMyReviews()
  const subjectReviewsQuery = useSubjectReviews(subject)
  const reputationQuery = useSubjectReputation(subject)
  const removeMutation = useRemoveReview()

  const myReviews = useMemo(
    () => filterReviews(myReviewsQuery.data ?? [], query),
    [myReviewsQuery.data, query]
  )
  const subjectReviews = useMemo(
    () => filterReviews(subjectReviewsQuery.data ?? [], query),
    [query, subjectReviewsQuery.data]
  )

  const loadSubject = () => {
    const trimmedSubjectId = subjectId.trim()
    if (!trimmedSubjectId) return
    setSubject({ subjectId: trimmedSubjectId, subjectType })
  }

  const removeReview = async (review: Review) => {
    await removeMutation.mutateAsync(review.id)
  }

  return (
    <>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Reviews</h2>
            <p className='text-muted-foreground'>
              Manage your reviews and inspect published reputation by subject.
            </p>
          </div>
          <Button
            disabled={!subject}
            onClick={() => {
              setEditingReview(null)
              setReviewFormOpen(true)
            }}
          >
            <Plus className='size-4' />
            New review
          </Button>
        </div>

        <div className='grid gap-3 rounded-md border border-[var(--bdr)] bg-[var(--sur)] p-4 lg:grid-cols-[180px_minmax(0,1fr)_auto] lg:items-end'>
          <div className='grid gap-2'>
            <Label>Subject type</Label>
            <Select
              value={subjectType}
              onValueChange={(value) =>
                setSubjectType(value as ReviewSubjectType)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REVIEW_SUBJECT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='review-subject-id'>Subject ID</Label>
            <Input
              id='review-subject-id'
              value={subjectId}
              onChange={(event) => setSubjectId(event.target.value)}
              placeholder='Backend subject UUID'
            />
          </div>
          <Button variant='outline' onClick={loadSubject}>
            <Search className='size-4' />
            Load subject
          </Button>
        </div>

        {subject && (
          <div className='grid gap-4 sm:grid-cols-2'>
            <StatCard
              label='Average rating'
              value={
                reputationQuery.data
                  ? formatRating(reputationQuery.data.averageRating)
                  : 'Not loaded'
              }
              foot='Reputation projection for the selected subject'
            />
            <StatCard
              label='Review count'
              value={String(reputationQuery.data?.reviewCount ?? 0)}
              foot={`${subject.subjectType} ${subject.subjectId}`}
            />
          </div>
        )}

        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder='Search reviews...'
          className='max-w-[480px]'
        />

        <Tabs defaultValue='mine'>
          <TabsList>
            <TabsTrigger value='mine'>My reviews</TabsTrigger>
            <TabsTrigger value='subject'>Subject reviews</TabsTrigger>
          </TabsList>

          <TabsContent value='mine' className='mt-4'>
            <ApiQueryState
              emptyDescription='The backend returned no reviews for this account.'
              emptyTitle='No reviews'
              error={myReviewsQuery.error}
              hasData={myReviews.length > 0}
              isError={myReviewsQuery.isError}
              isLoading={myReviewsQuery.isLoading}
              loadingLabel='Loading your reviews...'
              onRetry={() => void myReviewsQuery.refetch()}
            >
              <ReviewsTable
                mode='mine'
                reviews={myReviews}
                onEdit={(review) => {
                  setEditingReview(review)
                  setReviewFormOpen(true)
                }}
                onRemove={removeReview}
              />
            </ApiQueryState>
          </TabsContent>

          <TabsContent value='subject' className='mt-4'>
            {!subject && (
              <ApiEmpty
                title='No subject selected'
                description='Load a backend subject type and UUID to inspect published reviews.'
              />
            )}
            {subject && (
              <ApiQueryState
                emptyDescription='The backend returned no published reviews for this subject.'
                emptyTitle='No subject reviews'
                error={subjectReviewsQuery.error}
                hasData={subjectReviews.length > 0}
                isError={subjectReviewsQuery.isError}
                isLoading={subjectReviewsQuery.isLoading}
                loadingLabel='Loading subject reviews...'
                onRetry={() => void subjectReviewsQuery.refetch()}
              >
                <ReviewsTable mode='subject' reviews={subjectReviews} />
              </ApiQueryState>
            )}
          </TabsContent>
        </Tabs>
      </Main>

      <ReviewFormDialog
        open={reviewFormOpen}
        onOpenChange={(open) => {
          setReviewFormOpen(open)
          if (!open) setEditingReview(null)
        }}
        review={editingReview}
        subject={subject}
      />
    </>
  )
}
