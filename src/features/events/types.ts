import type {
  CreateEventDto,
  CreateVenueDto,
  EventDto,
  EventRsvpDto,
  EventStatus,
  EventType,
  RsvpStatus,
  SubmitRsvpDto,
  VenueDto,
} from '@/lib/api/generated/model'

export type Event = EventDto
export type Venue = VenueDto
export type EventRsvp = EventRsvpDto
export type EventStatusValue = EventStatus
export type EventTypeValue = EventType
export type RsvpStatusValue = RsvpStatus
export type CreateEventRequest = CreateEventDto
export type CreateVenueRequest = CreateVenueDto
export type SubmitRsvpRequest = SubmitRsvpDto
