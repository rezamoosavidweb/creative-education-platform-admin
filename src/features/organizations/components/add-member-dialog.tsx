import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, UserPlus } from 'lucide-react'
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
import { useAddOrganizationMember } from '../hooks/use-add-organization-member'
import type { AddMemberRequest, OrgRole } from '../types'

const addMemberSchema = z.object({
  userId: z.string().trim().uuid('User ID must be a UUID.'),
  role: z
    .custom<
      OrgRole | undefined
    >((value) => value === undefined || (typeof value === 'string' && value.trim().length > 0), 'Role is required when provided.')
    .optional(),
})

type AddMemberDialogProps = {
  onOpenChange: (open: boolean) => void
  open: boolean
  orgId: string
}

export function AddMemberDialog({
  onOpenChange,
  open,
  orgId,
}: AddMemberDialogProps) {
  const addMutation = useAddOrganizationMember()
  const { form, handleApiSubmit } = useApiForm<AddMemberRequest>({
    defaultValues: {
      userId: '',
    },
    resolver: zodResolver(addMemberSchema),
  })

  const onSubmit = handleApiSubmit(async (values) => {
    const role = values.role?.trim()
    const addPromise = addMutation.mutateAsync({
      orgId,
      body: {
        userId: values.userId.trim(),
        role: role ? (role as OrgRole) : undefined,
      },
    })

    toast.promise(addPromise, {
      loading: 'Adding member...',
      success: 'Member added.',
      error: getApiErrorMessage,
    })

    await addPromise
    form.reset()
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add member</DialogTitle>
          <DialogDescription>
            Add an existing user to this organization.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id='add-organization-member-form' onSubmit={onSubmit}>
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='userId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User ID</FormLabel>
                    <FormControl>
                      <Input disabled={addMutation.isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input
                        disabled={addMutation.isPending}
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
            form='add-organization-member-form'
            disabled={addMutation.isPending}
          >
            {addMutation.isPending ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <UserPlus className='size-4' />
            )}
            Add member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
