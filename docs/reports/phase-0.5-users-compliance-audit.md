# Phase 0.5 Users Compliance Audit

## Summary

The Users module now matches the backend-supported admin user surface. The
backend exposes read-only list and detail endpoints, so the Admin app no longer
keeps unused add, edit, delete, invite, activate, or deactivate user scaffolding.

## Backend Contracts

- `GET /users`
  - Requires `identity.user.read`.
  - Supports `page`, `take`, `q`, and `order`.
- `GET /users/{id}`
  - Requires `identity.user.read`.
  - Returns a single `UserDto`.

## Frontend Changes

- Added `USER_READ_CAPABILITY` from the backend capability key.
- Added route-level capability metadata for users list and detail routes.
- Added `identity.user.read` to the sidebar Users entry.
- Updated command-palette tests for user navigation capability filtering.
- Removed unused mock mutation dialogs, providers, action menus, and fake user
  fixture data.
- Updated Users page copy to describe review/detail behavior instead of
  unsupported management actions.

## Decision

Do not reintroduce user creation, deletion, invitation, or status-change UI
until the backend exposes explicit contracts for those operations.
