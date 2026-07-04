import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusPill } from '@/components/status-pill'
import { getRsvpStatusTone } from '../services/events-query'
import type { Event, EventRsvp } from '../types'

type RsvpsTableProps = {
  events: Event[]
  rsvps: EventRsvp[]
}

export function RsvpsTable({ events, rsvps }: RsvpsTableProps) {
  return (
    <div className='rounded-md border bg-[var(--sur)]'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>RSVP ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rsvps.map((rsvp) => {
            const event = events.find((item) => item.id === rsvp.eventId)

            return (
              <TableRow key={rsvp.id}>
                <TableCell className='min-w-[260px] whitespace-normal'>
                  <div className='font-medium'>
                    {event?.title ?? 'Unknown event'}
                  </div>
                  <div className='font-mono text-xs text-muted-foreground'>
                    {rsvp.eventId}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusPill tone={getRsvpStatusTone(rsvp.status)}>
                    {rsvp.status}
                  </StatusPill>
                </TableCell>
                <TableCell className='font-mono text-xs'>{rsvp.id}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
