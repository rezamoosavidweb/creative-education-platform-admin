import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
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
import { useAssignOrganizationRole } from '../hooks/use-assign-organization-role'
import type { AssignOrgRoleRequest, OrgMembership, OrgRole } from '../types'

const assignRoleSchema = z.object({
  role: z.custom<OrgRole>(
    (value) => typeof value === 'string' && value.trim().length > 0,
    'Role is required.'
  ),
})

type AssignRoleDialogProps = {
  membership: OrgMembership | null
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function AssignRoleDialog({
  membership,
  onOpenChange,
  open,
}: AssignRoleDialogProps) {
  const assignMutation = useAssignOrganizationRole()
  const { form, handleApiSubmit } = useApiForm<AssignOrgRoleRequest>({
    values: membership ? { role: membership.role } : undefined,
    resolver: zodResolver(assignRoleSchema),
  })

  const onSubmit = handleApiSubmit(async (values) => {
    if (!membership) return

    const assignPromise = assignMutation.mutateAsync({
      orgId: membership.orgId,
      userId: membership.userId,
      body: {
        role: values.role,
      },
    })

    toast.promise(assignPromise, {
      loading: 'Assigning role...',
      success: 'Role assigned.',
      error: getApiErrorMessage,
    })

    await assignPromise
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign role</DialogTitle>
          <DialogDescription>
            {membership
              ? `Update role for user ${membership.userId}.`
              : 'Update this organization member role.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id='assign-organization-role-form' onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input
                      disabled={assignMutation.isPending}
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
          </form>
        </Form>
        <DialogFooter>
          <Button
            type='submit'
            form='assign-organization-role-form'
            disabled={!membership || assignMutation.isPending}
          >
            {assignMutation.isPending ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <ShieldCheck className='size-4' />
            )}
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
