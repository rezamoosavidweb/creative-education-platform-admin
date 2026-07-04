# Phase 0.6 Identity Verification Audit

## Summary

The Identity Verification admin route now focuses on the backend-supported staff
review workflow: queue, approve, and reject. The self-service current-user
request UI was removed from this staff-only page.

## Backend Contracts

- `GET /profiles/verifications/queue`
  - Requires `profiles.verification.review`.
  - Returns pending verification requests.
- `POST /profiles/verifications/{id}/approve`
  - Requires `profiles.verification.review`.
  - Approves a pending verification request.
- `POST /profiles/verifications/{id}/reject`
  - Requires `profiles.verification.review`.
  - Rejects a pending verification request with an optional note.
- `POST /profiles/me/verifications`
  - Current-user self-service request endpoint.
  - Not shown on the staff review route.

## Frontend Changes

- Removed the request verification button from the admin queue page.
- Removed the orphaned self-service request dialog and hook from the admin
  verification feature.
- Kept route-level and navigation capability requirements aligned with
  `profiles.verification.review`.
- Added a rendered-page regression test to prevent self-service request controls
  from returning to the staff queue.

## Decision

Keep self-service profile verification requests separate from the admin staff
review queue unless the backend adds an explicit staff-on-behalf-of-user
contract.
