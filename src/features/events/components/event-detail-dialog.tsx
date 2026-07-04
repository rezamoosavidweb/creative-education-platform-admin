import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ApiEmpty, ApiError, ApiLoading } from '@/components/api'
import { StatusPill } from '@/components/status-pill'
import { useEventAttendees, usePublicEvent } from '../hooks/use-events-queries'
import {
  formatEventDate,
  formatOptionalEventDate,
  getEventStatusTone,
  getRsvpStatusTone,
  getVenueLabel,
} from '../services/events-query'
import type { Event, Venue } from '../types'

type EventDetailDialogProps = {
  event: Event | null
  mode: 'public' | 'organizer'
  onOpenChange: (open: boolean) => void
  open: boolean
  venues: Venue[]
}

export function EventDetailDialog({
  event,
  mode,
  onOpenChange,
  open,
  venues,
}: EventDetailDialogProps) {
  const publicEventQuery = usePublicEvent(
    event?.id ?? null,
    open && mode === 'public'
  )
  const attendeesQuery = useEventAttendees(
    event?.id ?? null,
    open && mode === 'organizer'
  )
  const displayedEvent = publicEventQuery.data ?? event

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[680px]'>
        <DialogHeader>
          <DialogTitle>{displayedEvent?.title ?? 'Event details'}</DialogTitle>
          <DialogDescription>
            {mode === 'organizer'
              ? 'Organizer view with confirmed attendees.'
              : 'Published event detail from the public contract.'}
          </DialogDescription>
        </DialogHeader>

        {mode === 'public' && publicEventQuery.isLoading && (
          <ApiLoading label='Loading event details...' />
        )}
        {mode === 'public' && publicEventQuery.isError && (
          <ApiError
            error={publicEventQuery.error}
            onRetry={() => void publicEventQuery.refetch()}
          />
        )}

        {displayedEvent && (
          <div className='grid gap-4 text-sm'>
            <div className='flex flex-wrap items-center gap-2'>
              <StatusPill tone={getEventStatusTone(displayedEvent.status)}>
                {displayedEvent.status}
              </StatusPill>
              <span className='text-muted-foreground'>
                {displayedEvent.type}
              </span>
            </div>
            <dl className='grid gap-3 sm:grid-cols-2'>
              <div>
                <dt className='text-muted-foreground'>Starts</dt>
                <dd className='font-medium'>
                  {formatEventDate(displayedEvent.startsAt)}
                </dd>
              </div>
              <div>
                <dt className='text-muted-foreground'>Ends</dt>
                <dd className='font-medium'>
                  {formatOptionalEventDate(displayedEvent.endsAt)}
                </dd>
              </div>
              <div>
                <dt className='text-muted-foreground'>Venue</dt>
                <dd className='font-medium'>
                  {getVenueLabel(displayedEvent.venueId, venues)}
                </dd>
              </div>
              <div>
                <dt className='text-muted-foreground'>Capacity</dt>
                <dd className='font-medium'>
                  {displayedEvent.capacity ?? 'Unlimited'}
                </dd>
              </div>
            </dl>
            {displayedEvent.description && (
              <p className='text-muted-foreground'>
                {displayedEvent.description}
              </p>
            )}

            {mode === 'organizer' && (
              <div className='rounded-md border p-4'>
                <h3 className='mb-3 text-sm font-medium'>
                  Confirmed attendees
                </h3>
                {attendeesQuery.isLoading && (
                  <ApiLoading label='Loading attendees...' />
                )}
                {attendeesQuery.isError && (
                  <ApiError
                    error={attendeesQuery.error}
                    onRetry={() => void attendeesQuery.refetch()}
                  />
                )}
                {!attendeesQuery.isLoading &&
                  !attendeesQuery.isError &&
                  (attendeesQuery.data?.length ?? 0) === 0 && (
                    <ApiEmpty
                      title='No attendees'
                      description='The backend returned no confirmed attendees for this event.'
                    />
                  )}
                {!attendeesQuery.isLoading &&
                  !attendeesQuery.isError &&
                  (attendeesQuery.data?.length ?? 0) > 0 && (
                    <div className='grid gap-2'>
                      {attendeesQuery.data?.map((attendee) => (
                        <div
                          key={attendee.id}
                          className='flex items-center justify-between gap-3 rounded-md border px-3 py-2'
                        >
                          <span className='font-mono text-xs'>
                            {attendee.userId}
                          </span>
                          <StatusPill tone={getRsvpStatusTone(attendee.status)}>
                            {attendee.status}
                          </StatusPill>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
