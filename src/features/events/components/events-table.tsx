import { CalendarX, Eye, Send } from 'lucide-react'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusPill } from '@/components/status-pill'
import {
  formatEventDate,
  getEventRsvp,
  getEventStatusTone,
  getRsvpStatusTone,
  getVenueLabel,
} from '../services/events-query'
import type { Event, EventRsvp, RsvpStatusValue, Venue } from '../types'

type EventsTableProps = {
  events: Event[]
  mode: 'discovery' | 'organizer'
  onCancel?: (event: Event) => Promise<void>
  onOpenDetails: (event: Event) => void
  onPublish?: (event: Event) => Promise<void>
  onRsvp?: (event: Event, status: RsvpStatusValue) => Promise<void>
  rsvps?: EventRsvp[]
  venues: Venue[]
}

export function EventsTable({
  events,
  mode,
  onCancel,
  onOpenDetails,
  onPublish,
  onRsvp,
  rsvps = [],
  venues,
}: EventsTableProps) {
  const runEventAction = async (
    label: string,
    event: Event,
    action: ((event: Event) => Promise<void>) | undefined
  ) => {
    if (!action) return

    const promise = action(event)
    toast.promise(promise, {
      loading: `${label} event...`,
      success: `Event ${label.toLowerCase()}ed.`,
      error: getApiErrorMessage,
    })
    await promise
  }

  const runRsvpAction = async (event: Event, status: RsvpStatusValue) => {
    if (!onRsvp) return

    const promise = onRsvp(event, status)
    toast.promise(promise, {
      loading: 'Submitting RSVP...',
      success: 'RSVP updated.',
      error: getApiErrorMessage,
    })
    await promise
  }

  return (
    <div className='rounded-md border bg-[var(--sur)]'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Starts</TableHead>
            <TableHead>Venue</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead className='text-end'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => {
            const rsvp = getEventRsvp(event.id, rsvps)

            return (
              <TableRow key={event.id}>
                <TableCell className='min-w-[260px] whitespace-normal'>
                  <div className='font-medium'>{event.title}</div>
                  <div className='text-xs text-muted-foreground'>
                    {event.type} - {event.disciplineIds.length} disciplines
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex flex-col items-start gap-1'>
                    <StatusPill tone={getEventStatusTone(event.status)}>
                      {event.status}
                    </StatusPill>
                    {rsvp && (
                      <StatusPill tone={getRsvpStatusTone(rsvp.status)}>
                        RSVP {rsvp.status}
                      </StatusPill>
                    )}
                  </div>
                </TableCell>
                <TableCell>{formatEventDate(event.startsAt)}</TableCell>
                <TableCell>{getVenueLabel(event.venueId, venues)}</TableCell>
                <TableCell>{event.capacity ?? 'Unlimited'}</TableCell>
                <TableCell>
                  <div className='flex justify-end gap-2'>
                    <Button
                      size='icon'
                      variant='ghost'
                      aria-label={`View ${event.title}`}
                      onClick={() => onOpenDetails(event)}
                    >
                      <Eye className='size-4' />
                    </Button>
                    {mode === 'organizer' && event.status === 'DRAFT' && (
                      <Button
                        size='icon'
                        variant='ghost'
                        aria-label={`Publish ${event.title}`}
                        onClick={() =>
                          void runEventAction('Publish', event, onPublish)
                        }
                      >
                        <Send className='size-4' />
                      </Button>
                    )}
                    {mode === 'organizer' && event.status !== 'CANCELLED' && (
                      <Button
                        size='icon'
                        variant='ghost'
                        aria-label={`Cancel ${event.title}`}
                        onClick={() =>
                          void runEventAction('Cancel', event, onCancel)
                        }
                      >
                        <CalendarX className='size-4' />
                      </Button>
                    )}
                    {mode === 'discovery' && (
                      <>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => void runRsvpAction(event, 'GOING')}
                        >
                          Going
                        </Button>
                        <Button
                          size='sm'
                          variant='ghost'
                          onClick={() =>
                            void runRsvpAction(event, 'INTERESTED')
                          }
                        >
                          Interested
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
