import type { PillTone } from '@/components/status-pill'
import type {
  Event,
  EventRsvp,
  EventStatusValue,
  EventTypeValue,
  RsvpStatusValue,
  Venue,
} from '../types'

export const EVENT_TYPE_OPTIONS: {
  label: string
  value: EventTypeValue
}[] = [
  { label: 'Concert', value: 'CONCERT' },
  { label: 'Workshop', value: 'WORKSHOP' },
  { label: 'Competition', value: 'COMPETITION' },
  { label: 'Masterclass', value: 'MASTERCLASS' },
  { label: 'Recital', value: 'RECITAL' },
  { label: 'Screening', value: 'SCREENING' },
  { label: 'Exhibition', value: 'EXHIBITION' },
  { label: 'Showcase', value: 'SHOWCASE' },
  { label: 'Performance', value: 'PERFORMANCE' },
]

export const EVENT_STATUS_OPTIONS: {
  label: string
  value: EventStatusValue
}[] = [
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Started', value: 'STARTED' },
  { label: 'Cancelled', value: 'CANCELLED' },
]

export const RSVP_STATUS_OPTIONS: {
  label: string
  value: RsvpStatusValue
}[] = [
  { label: 'Going', value: 'GOING' },
  { label: 'Interested', value: 'INTERESTED' },
  { label: 'Cancelled', value: 'CANCELLED' },
]

export function formatEventDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function formatOptionalEventDate(value: string | null | undefined) {
  return value ? formatEventDate(value) : 'Not set'
}

export function getEventStatusTone(status: EventStatusValue): PillTone {
  switch (status) {
    case 'PUBLISHED':
    case 'STARTED':
      return 'ok'
    case 'CANCELLED':
      return 'err'
    case 'DRAFT':
    default:
      return 'warn'
  }
}

export function getRsvpStatusTone(status: RsvpStatusValue): PillTone {
  switch (status) {
    case 'GOING':
      return 'ok'
    case 'INTERESTED':
      return 'info'
    case 'CANCELLED':
    default:
      return 'neutral'
  }
}

export function getVenueLabel(
  venueId: string | null | undefined,
  venues: Venue[]
) {
  if (!venueId) return 'Online or TBD'

  return venues.find((venue) => venue.id === venueId)?.name ?? 'Unknown venue'
}

export function getVenueLocation(venue: Venue): string {
  return [venue.city, venue.country].filter(Boolean).join(', ') || 'No location'
}

export function filterEvents(
  events: Event[],
  options: {
    query: string
    status?: EventStatusValue | 'all'
    type?: EventTypeValue | 'all'
  }
): Event[] {
  const query = options.query.trim().toLowerCase()

  return events
    .filter((event) =>
      options.status && options.status !== 'all'
        ? event.status === options.status
        : true
    )
    .filter((event) =>
      options.type && options.type !== 'all'
        ? event.type === options.type
        : true
    )
    .filter((event) =>
      query
        ? [event.title, event.description, event.type, event.status]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(query))
        : true
    )
    .sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
    )
}

export function getEventRsvp(
  eventId: string,
  rsvps: EventRsvp[]
): EventRsvp | undefined {
  return rsvps.find((rsvp) => rsvp.eventId === eventId)
}
