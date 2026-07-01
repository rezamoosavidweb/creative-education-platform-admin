import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Users } from 'lucide-react'
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
import { useCreateOrganizationTeam } from '../hooks/use-create-organization-team'
import type { CreateTeamRequest } from '../types'

const createTeamSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
})

type CreateTeamDialogProps = {
  onOpenChange: (open: boolean) => void
  open: boolean
  orgId: string
}

export function CreateTeamDialog({
  onOpenChange,
  open,
  orgId,
}: CreateTeamDialogProps) {
  const createMutation = useCreateOrganizationTeam()
  const { form, handleApiSubmit } = useApiForm<CreateTeamRequest>({
    defaultValues: {
      name: '',
    },
    resolver: zodResolver(createTeamSchema),
  })

  const onSubmit = handleApiSubmit(async (values) => {
    const createPromise = createMutation.mutateAsync({
      orgId,
      body: {
        name: values.name.trim(),
      },
    })

    toast.promise(createPromise, {
      loading: 'Creating team...',
      success: 'Team created.',
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
          <DialogTitle>New team</DialogTitle>
          <DialogDescription>
            Create a team inside this organization.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id='create-organization-team-form' onSubmit={onSubmit}>
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
          </form>
        </Form>
        <DialogFooter>
          <Button
            type='submit'
            form='create-organization-team-form'
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <Users className='size-4' />
            )}
            Create team
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
