import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import { useRejectVerification } from '../hooks/use-reject-verification'
import type { ProfileVerification, RejectVerificationRequest } from '../types'

const rejectVerificationSchema = z.object({
  note: z.string().trim().optional(),
})

type RejectVerificationDialogProps = {
  onOpenChange: (open: boolean) => void
  open: boolean
  verification: ProfileVerification | null
}

export function RejectVerificationDialog({
  onOpenChange,
  open,
  verification,
}: RejectVerificationDialogProps) {
  const rejectMutation = useRejectVerification()
  const { form, handleApiSubmit } = useApiForm<RejectVerificationRequest>({
    defaultValues: {
      note: '',
    },
    resolver: zodResolver(rejectVerificationSchema),
  })

  const onSubmit = handleApiSubmit(async (values) => {
    if (!verification) return

    const rejectPromise = rejectMutation.mutateAsync({
      id: verification.id,
      body: {
        note: values.note?.trim() || undefined,
      },
    })

    toast.promise(rejectPromise, {
      loading: 'Rejecting verification...',
      success: 'Verification rejected.',
      error: getApiErrorMessage,
    })

    await rejectPromise
    form.reset()
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject verification</DialogTitle>
          <DialogDescription>
            {verification
              ? `Reject ${verification.profileType} verification for user ${verification.userId}.`
              : 'Reject this verification request.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id='reject-verification-form' onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name='note'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review note</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Optional rejection note'
                      disabled={rejectMutation.isPending}
                      {...field}
                    />
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
            form='reject-verification-form'
            variant='destructive'
            disabled={!verification || rejectMutation.isPending}
          >
            {rejectMutation.isPending && (
              <Loader2 className='size-4 animate-spin' />
            )}
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
