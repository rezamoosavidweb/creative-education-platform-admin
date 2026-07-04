import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusPill } from '@/components/status-pill'
import {
  formatRating,
  formatSubjectLabel,
  getReviewStatusTone,
} from '../services/reviews-query'
import type { Review } from '../types'

type ReviewsTableProps = {
  mode: 'mine' | 'subject'
  onEdit?: (review: Review) => void
  onRemove?: (review: Review) => Promise<void>
  reviews: Review[]
}

export function ReviewsTable({
  mode,
  onEdit,
  onRemove,
  reviews,
}: ReviewsTableProps) {
  const remove = async (review: Review) => {
    if (!onRemove) return

    const promise = onRemove(review)
    toast.promise(promise, {
      loading: 'Removing review...',
      success: 'Review removed.',
      error: getApiErrorMessage,
    })
    await promise
  }

  return (
    <div className='rounded-md border bg-[var(--sur)]'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Review</TableHead>
            {mode === 'mine' && (
              <TableHead className='text-end'>Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review) => (
            <TableRow key={review.id}>
              <TableCell className='min-w-[240px] whitespace-normal'>
                <div className='font-medium'>{formatSubjectLabel(review)}</div>
                <div className='text-xs text-muted-foreground'>
                  Author {review.authorUserId}
                </div>
              </TableCell>
              <TableCell>{formatRating(review.rating)}</TableCell>
              <TableCell>
                <StatusPill tone={getReviewStatusTone(review.status)}>
                  {review.status}
                </StatusPill>
              </TableCell>
              <TableCell className='max-w-[420px] text-sm whitespace-normal'>
                {review.body ?? 'No body provided.'}
              </TableCell>
              {mode === 'mine' && (
                <TableCell>
                  <div className='flex justify-end gap-2'>
                    <Button
                      size='icon'
                      variant='ghost'
                      aria-label={`Edit review ${review.id}`}
                      onClick={() => onEdit?.(review)}
                    >
                      <Pencil className='size-4' />
                    </Button>
                    <Button
                      size='icon'
                      variant='ghost'
                      aria-label={`Remove review ${review.id}`}
                      onClick={() => void remove(review)}
                    >
                      <Trash2 className='size-4' />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
