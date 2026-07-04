# Phase 0.19 Marketplace Audit

## Scope

Implemented the backend-backed Marketplace module from the marketplace bounded
context.

## Backend Contracts

Used generated Marketplace endpoint functions for:

- `GET /services` published service discovery.
- `GET /services/mine` current-user service listings.
- `POST /services` service listing draft creation.
- `POST /services/{id}/publish` listing publish.
- `POST /services/{id}/unlist` listing unlist.
- `GET /jobs` open job discovery.
- `POST /jobs` job posting.
- `POST /jobs/{id}/close` hirer job close.
- `POST /jobs/{id}/applications` job application submission.
- `GET /jobs/{id}/applications` hirer application lookup.
- `GET /jobs/mine/applications` current-user submitted applications.
- `POST /jobs/applications/{id}/accept` application acceptance.
- `POST /jobs/applications/{id}/reject` application rejection.
- `POST /jobs/applications/{id}/withdraw` applicant withdrawal.
- `GET /contracts/mine` current-user contracts.
- `POST /contracts/{id}/complete` active contract completion.
- `POST /contracts/{id}/cancel` active contract cancellation.

The backend does not expose a current-user posted jobs list, service or job
update/delete endpoints, contract update endpoints, global marketplace
moderation, or pagination metadata. The Admin UI is therefore scoped to service
listings, open jobs, submitted applications, and current-user contracts.

## Changes

- Added `/marketplace` route and Learning navigation entry.
- Added Services, My services, Jobs, Applications, and Contracts tabs.
- Added marketplace-wide search over services and jobs.
- Added service listing and job posting dialogs using generated DTO-compatible
  payloads.
- Added application submission, withdrawal, hirer accept/reject, service
  publish/unlist, job close, and contract complete/cancel workflows.
- Added loading, error, empty, and responsive table states.
- Added unit coverage for money formatting, status tones, taxonomy counts, and
  client-side filtering.

## Follow-Up

If backend posted-job listing, update/delete, moderation, or pagination
contracts are added later, extend this module from generated contracts rather
than local API assumptions.
