import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api'
import { useApiForm } from '@/lib/forms'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useEditReview, useSubmitReview } from '../hooks/use-reviews-queries'
import type { Review, ReviewSubject } from '../types'

const reviewSchema = z.object({
  body: z.string().trim().max(2000).optional(),
  rating: z.coerce.number().int().min(1).max(5),
})

type ReviewFormDialogProps = {
  onOpenChange: (open: boolean) => void
  open: boolean
  review?: Review | null
  subject: ReviewSubject | null
}

export function ReviewFormDialog({
  onOpenChange,
  open,
  review,
  subject,
}: ReviewFormDialogProps) {
  const submitMutation = useSubmitReview()
  const editMutation = useEditReview()
  const isEdit = Boolean(review)
  const isPending = submitMutation.isPending || editMutation.isPending
  const { form, handleApiSubmit } = useApiForm<z.input<typeof reviewSchema>>({
    defaultValues: {
      body: review?.body ?? '',
      rating: review?.rating ?? 5,
    },
    resolver: zodResolver(reviewSchema),
    values: {
      body: review?.body ?? '',
      rating: review?.rating ?? 5,
    },
  })

  const onSubmit = handleApiSubmit(async (values) => {
    if (!subject && !review) return

    const body = {
      body: values.body || undefined,
      rating: Number(values.rating),
    }
    const promise =
      review && isEdit
        ? editMutation.mutateAsync({ body, id: review.id })
        : submitMutation.mutateAsync({
            ...body,
            subjectId: subject!.subjectId,
            subjectType: subject!.subjectType,
          })

    toast.promise(promise, {
      loading: isEdit ? 'Updating review...' : 'Submitting review...',
      success: isEdit ? 'Review updated.' : 'Review submitted.',
      error: getApiErrorMessage,
    })

    await promise
    form.reset()
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit review' : 'Submit review'}</DialogTitle>
          <DialogDescription>
            Reviews require backend eligibility and are published by the review
            service.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id='review-form' onSubmit={onSubmit} className='grid gap-4'>
            <FormField
              control={form.control}
              name='rating'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      min={1}
                      max={5}
                      disabled={isPending}
                      value={field.value as number | string | undefined}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='body'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body</FormLabel>
                  <FormControl>
                    <Textarea disabled={isPending} rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            type='submit'
            form='review-form'
            disabled={isPending || (!subject && !review)}
          >
            {isPending ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <Send className='size-4' />
            )}
            {isEdit ? 'Save' : 'Submit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
