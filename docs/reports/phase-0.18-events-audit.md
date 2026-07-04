# Phase 0.18 Events Audit

## Scope

Implemented the backend-backed Events module from the Events bounded context.

## Backend Contracts

Used generated Events endpoint functions for:

- `GET /events` published event discovery.
- `GET /events/mine` current-user organizer events.
- `GET /events/rsvps/mine` current-user RSVPs.
- `GET /events/{id}` published event detail.
- `POST /events` draft event creation.
- `POST /events/{id}/publish` organizer publish.
- `POST /events/{id}/cancel` organizer cancel.
- `POST /events/{id}/rsvp` attendee RSVP submission.
- `GET /events/{id}/attendees` organizer attendee lookup.
- `GET /venues` venue listing.
- `POST /venues` venue creation.

The backend does not expose event update/delete endpoints or a global event
moderation queue. The Admin UI is therefore scoped to discovery, current-user
organizer workflows, RSVPs, and venue creation.

## Changes

- Added `/events` route and Learning navigation entry.
- Added Discovery, Organized, RSVPs, and Venues tabs.
- Added event search, status filtering, type filtering, and date sorting.
- Added event and venue creation dialogs using generated enum values and
  backend validation limits.
- Added publish, cancel, RSVP, public detail, and attendee-detail workflows.
- Added loading, error, empty, and responsive table states.
- Added unit coverage for event filtering, status tones, RSVP tones, venue
  labels, and RSVP lookup.

## Follow-Up

If backend update/delete endpoints, global moderation, venue ownership, or event
pagination are added later, extend this module from the generated contracts.
