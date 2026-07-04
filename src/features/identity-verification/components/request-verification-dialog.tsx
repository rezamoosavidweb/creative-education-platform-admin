import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, ShieldCheck } from 'lucide-react'
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
import { SelectDropdown } from '@/components/select-dropdown'
import { useRequestVerification } from '../hooks/use-request-verification'
import type { ProfileType, RequestVerificationRequest } from '../types'

const PROFILE_TYPE_OPTIONS = [
  { label: 'Practitioner', value: 'PRACTITIONER' },
  { label: 'Instructor', value: 'INSTRUCTOR' },
  { label: 'Studio', value: 'STUDIO' },
] satisfies { label: string; value: ProfileType }[]

const requestVerificationSchema = z.object({
  profileType: z.enum(['PRACTITIONER', 'INSTRUCTOR', 'STUDIO']),
  evidence: z.string().trim().optional(),
})

type RequestVerificationDialogProps = {
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function RequestVerificationDialog({
  onOpenChange,
  open,
}: RequestVerificationDialogProps) {
  const requestMutation = useRequestVerification()
  const { form, handleApiSubmit } = useApiForm<RequestVerificationRequest>({
    defaultValues: {
      profileType: 'PRACTITIONER',
      evidence: '',
    },
    resolver: zodResolver(requestVerificationSchema),
  })

  const onSubmit = handleApiSubmit(async (values) => {
    const requestPromise = requestMutation.mutateAsync({
      ...values,
      evidence: values.evidence?.trim() || undefined,
    })

    toast.promise(requestPromise, {
      loading: 'Requesting verification...',
      success: 'Verification requested.',
      error: getApiErrorMessage,
    })

    await requestPromise
    form.reset()
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request verification</DialogTitle>
          <DialogDescription>
            Submit a profile verification request for the current user.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id='request-verification-form' onSubmit={onSubmit}>
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='profileType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile type</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      items={PROFILE_TYPE_OPTIONS}
                      isControlled
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='evidence'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Evidence</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Evidence URL or reviewer note'
                        disabled={requestMutation.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button
            type='submit'
            form='request-verification-form'
            disabled={requestMutation.isPending}
          >
            {requestMutation.isPending ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <ShieldCheck className='size-4' />
            )}
            Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
