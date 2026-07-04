# Phase 0.8 Profiles Audit

## Summary

The Profiles module was audited against the backend directory and current-user
profile contracts. The existing split between public directory search and
current-user profile/persona management matches the backend. Persona
availability controls now use generated enum values instead of free text.

## Backend Contracts

- `GET /directory`
  - Searches published profiles by supported directory filters.
- `GET /profiles/me`
  - Reads the current user's profile.
- `PATCH /profiles/me`
  - Updates current-user profile fields.
- `PATCH /profiles/me/handle`
  - Changes the current user's public handle.
- `POST /profiles/me/publish`
  - Publishes the current user's profile.
- `POST /profiles/me/unpublish`
  - Unpublishes the current user's profile.
- `GET /profiles/{handle}`
  - Reads a published public profile by handle.
- `GET/POST/PATCH` current-user practitioner, instructor, and studio profile
  endpoints.
- `GET/POST/PUT/DELETE /profiles/me/portfolio...`
  - Current-user portfolio management endpoints.

## Frontend Changes

- Added generated availability status options for persona profile forms.
- Replaced free-text availability status inputs with select controls.
- Added test coverage for availability enum option coverage.

## Decision

Keep Profiles scoped to public directory search plus current-user profile
management. Do not present it as global profile administration unless backend
contracts add global profile management endpoints.
