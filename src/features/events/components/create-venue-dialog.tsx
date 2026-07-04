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
import { useCreateVenue } from '../hooks/use-events-queries'
import type { CreateVenueRequest } from '../types'

const createVenueSchema = z.object({
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  country: z.string().trim().optional(),
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters.')
    .max(160),
})

type CreateVenueDialogProps = {
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function CreateVenueDialog({
  onOpenChange,
  open,
}: CreateVenueDialogProps) {
  const createMutation = useCreateVenue()
  const { form, handleApiSubmit } = useApiForm<CreateVenueRequest>({
    defaultValues: {
      address: '',
      city: '',
      country: '',
      name: '',
    },
    resolver: zodResolver(createVenueSchema),
  })

  const onSubmit = handleApiSubmit(async (values) => {
    const createPromise = createMutation.mutateAsync({
      address: values.address?.trim() || undefined,
      city: values.city?.trim() || undefined,
      country: values.country?.trim() || undefined,
      name: values.name.trim(),
    })

    toast.promise(createPromise, {
      loading: 'Creating venue...',
      success: 'Venue created.',
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
          <DialogTitle>New venue</DialogTitle>
          <DialogDescription>
            Create a venue that organizers can attach to events.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id='create-venue-form' onSubmit={onSubmit}>
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
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input disabled={createMutation.isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='grid gap-4 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='city'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input disabled={createMutation.isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='country'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input disabled={createMutation.isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button
            type='submit'
            form='create-venue-form'
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
