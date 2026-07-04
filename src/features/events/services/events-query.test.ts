import { describe, expect, it } from 'vitest'
import type { Event, EventRsvp, Venue } from '../types'
import {
  filterEvents,
  formatOptionalEventDate,
  getEventRsvp,
  getEventStatusTone,
  getRsvpStatusTone,
  getVenueLabel,
  getVenueLocation,
} from './events-query'

const event = {
  bannerMediaId: null,
  capacity: 25,
  createdAt: '2026-01-01T00:00:00.000Z',
  description: 'Creative session',
  disciplineIds: ['discipline-1'],
  endsAt: null,
  id: 'event-1',
  organizerUserId: 'user-1',
  startsAt: '2026-01-02T10:00:00.000Z',
  status: 'PUBLISHED',
  title: 'Workshop',
  type: 'WORKSHOP',
  updatedAt: '2026-01-01T00:00:00.000Z',
  venueId: 'venue-1',
} satisfies Event

const venue = {
  address: 'Main Street',
  city: 'Tehran',
  country: 'Iran',
  createdAt: '2026-01-01T00:00:00.000Z',
  id: 'venue-1',
  name: 'Main Hall',
  updatedAt: '2026-01-01T00:00:00.000Z',
} satisfies Venue

const rsvp = {
  createdAt: '2026-01-01T00:00:00.000Z',
  eventId: 'event-1',
  id: 'rsvp-1',
  status: 'GOING',
  updatedAt: '2026-01-01T00:00:00.000Z',
  userId: 'user-2',
} satisfies EventRsvp

describe('events-query', () => {
  it('filters events by query, type, and status', () => {
    expect(
      filterEvents([event], {
        query: 'work',
        status: 'PUBLISHED',
        type: 'WORKSHOP',
      })
    ).toEqual([event])
    expect(
      filterEvents([event], {
        query: 'missing',
        status: 'all',
        type: 'all',
      })
    ).toEqual([])
  })

  it('maps display helpers from backend values', () => {
    expect(formatOptionalEventDate(null)).toBe('Not set')
    expect(getEventStatusTone('PUBLISHED')).toBe('ok')
    expect(getEventStatusTone('CANCELLED')).toBe('err')
    expect(getRsvpStatusTone('GOING')).toBe('ok')
    expect(getRsvpStatusTone('INTERESTED')).toBe('info')
    expect(getVenueLabel('venue-1', [venue])).toBe('Main Hall')
    expect(getVenueLabel(null, [venue])).toBe('Online or TBD')
    expect(getVenueLocation(venue)).toBe('Tehran, Iran')
    expect(getEventRsvp('event-1', [rsvp])).toBe(rsvp)
  })
})
