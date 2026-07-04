# Phase 0.20 Reviews Audit

## Scope

Implemented the backend-backed Reviews module from the reviews bounded context.

## Backend Contracts

Used generated Reviews endpoint functions for:

- `GET /reviews/mine` current-user review listing.
- `GET /reviews` published reviews for a subject.
- `POST /reviews` eligible review submission.
- `PATCH /reviews/{id}` current-user review edit.
- `DELETE /reviews/{id}` current-user review removal.
- `GET /reputation` subject reputation rollup.

The backend requires a `subjectType` and `subjectId` to inspect published
reviews or reputation. It does not expose a global moderation queue, review
approval workflow, reported-review queue, or subject directory endpoint.

## Changes

- Added `/reviews` route and Learning navigation entry.
- Added current-user reviews and selected-subject reviews tabs.
- Added subject type and subject UUID lookup controls based on generated enum
  values.
- Added reputation rollup cards for the selected subject.
- Added submit, edit, and remove workflows using generated DTO-compatible
  payloads.
- Added loading, error, empty, and responsive table states.
- Added unit coverage for subject type options, status tones, rating labels,
  subject labels, and client-side filtering.

## Follow-Up

If backend moderation, report handling, subject search, or pagination contracts
are added later, extend this module from generated contracts.
