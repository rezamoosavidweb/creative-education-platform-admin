import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Building2, Loader2 } from 'lucide-react'
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
import { useCreateOrganization } from '../hooks/use-create-organization'
import type { CreateOrganizationRequest, OrgType } from '../types'

const createOrganizationSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
  type: z.custom<OrgType>(
    (value) => typeof value === 'string' && value.trim().length > 0,
    'Type is required.'
  ),
})

type CreateOrganizationDialogProps = {
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function CreateOrganizationDialog({
  onOpenChange,
  open,
}: CreateOrganizationDialogProps) {
  const createMutation = useCreateOrganization()
  const { form, handleApiSubmit } = useApiForm<CreateOrganizationRequest>({
    defaultValues: {
      name: '',
    },
    resolver: zodResolver(createOrganizationSchema),
  })

  const onSubmit = handleApiSubmit(async (values) => {
    const createPromise = createMutation.mutateAsync({
      name: values.name.trim(),
      type: values.type,
    })

    toast.promise(createPromise, {
      loading: 'Creating organization...',
      success: 'Organization created.',
      error: getApiErrorMessage,
    })

    await createPromise
    form.reset()
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New organization</DialogTitle>
          <DialogDescription>
            Create an organization for the current authenticated user.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id='create-organization-form' onSubmit={onSubmit}>
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input disabled={createMutation.isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Input
                        disabled={createMutation.isPending}
                        value={field.value ?? ''}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                        name={field.name}
                        ref={field.ref}
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
            form='create-organization-form'
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <Building2 className='size-4' />
            )}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
