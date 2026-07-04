# Phase 0.10 Sessions Audit

## Summary

The Sessions module was audited against the backend identity auth-session
contracts. The page is correctly scoped to the current authenticated user's
active refresh-token sessions and does not expose global session administration.

## Backend Contracts

- `GET /auth/sessions`
  - Lists the current user's active refresh-token session lineages.
- `DELETE /auth/sessions/{id}`
  - Revokes one of the current user's active sessions, scoped by owner.

## Frontend Changes

- Removed a no-op capability gate from the revoke action.
- Kept the page ungated beyond authentication, matching backend auth rules.
- Kept the table unpaginated because the backend returns a plain active-session
  array.

## Decision

Treat this module as current-user security management only. Do not merge it with
the community scheduled sessions domain (`/sessions`) or present it as global
admin session management unless the backend adds those contracts.
