import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarPlus, Loader2 } from 'lucide-react'
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
import { SelectDropdown } from '@/components/select-dropdown'
import { useCreateEvent } from '../hooks/use-events-queries'
import { EVENT_TYPE_OPTIONS } from '../services/events-query'
import type { CreateEventRequest, EventTypeValue, Venue } from '../types'

const NO_VENUE_VALUE = 'none'

const createEventSchema = z.object({
  capacity: z.string().optional(),
  description: z.string().trim().optional(),
  disciplineIds: z.string().trim().optional(),
  endsAt: z.string().optional(),
  startsAt: z.string().min(1, 'Start time is required.'),
  title: z
    .string()
    .trim()
    .min(2, 'Title must be at least 2 characters.')
    .max(160),
  type: z.custom<EventTypeValue>(
    (value) => typeof value === 'string' && value.trim().length > 0,
    'Type is required.'
  ),
  venueId: z.string().optional(),
})

type EventFormValues = z.input<typeof createEventSchema>

type CreateEventDialogProps = {
  onOpenChange: (open: boolean) => void
  open: boolean
  venues: Venue[]
}

export function CreateEventDialog({
  onOpenChange,
  open,
  venues,
}: CreateEventDialogProps) {
  const createMutation = useCreateEvent()
  const venueOptions = [
    { label: 'Online or TBD', value: NO_VENUE_VALUE },
    ...venues.map((venue) => ({ label: venue.name, value: venue.id })),
  ]
  const { form, handleApiSubmit } = useApiForm<EventFormValues>({
    defaultValues: {
      capacity: '',
      description: '',
      disciplineIds: '',
      endsAt: '',
      startsAt: '',
      title: '',
      type: 'WORKSHOP',
      venueId: NO_VENUE_VALUE,
    },
    resolver: zodResolver(createEventSchema),
  })

  const onSubmit = handleApiSubmit(async (values) => {
    const body: CreateEventRequest = {
      capacity: values.capacity ? Number(values.capacity) : undefined,
      description: values.description?.trim() || undefined,
      disciplineIds: values.disciplineIds
        ? values.disciplineIds
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        : undefined,
      endsAt: values.endsAt ? new Date(values.endsAt).toISOString() : undefined,
      startsAt: new Date(values.startsAt).toISOString(),
      title: values.title.trim(),
      type: values.type,
      venueId:
        values.venueId && values.venueId !== NO_VENUE_VALUE
          ? values.venueId
          : undefined,
    }
    const createPromise = createMutation.mutateAsync(body)

    toast.promise(createPromise, {
      loading: 'Creating event...',
      success: 'Event draft created.',
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
          <DialogTitle>New event</DialogTitle>
          <DialogDescription>
            Create a draft event for the current authenticated organizer.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id='create-event-form' onSubmit={onSubmit}>
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
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
                  name='type'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <SelectDropdown
                        defaultValue={field.value}
                        disabled={createMutation.isPending}
                        isControlled
                        items={EVENT_TYPE_OPTIONS}
                        onValueChange={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='venueId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Venue</FormLabel>
                      <SelectDropdown
                        defaultValue={field.value}
                        disabled={createMutation.isPending}
                        isControlled
                        items={venueOptions}
                        onValueChange={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid gap-4 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='startsAt'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Starts at</FormLabel>
                      <FormControl>
                        <Input
                          type='datetime-local'
                          disabled={createMutation.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='endsAt'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ends at</FormLabel>
                      <FormControl>
                        <Input
                          type='datetime-local'
                          disabled={createMutation.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid gap-4 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='capacity'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          min={1}
                          disabled={createMutation.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='disciplineIds'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discipline IDs</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Comma separated'
                          disabled={createMutation.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={createMutation.isPending}
                        rows={4}
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
            form='create-event-form'
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <CalendarPlus className='size-4' />
            )}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
