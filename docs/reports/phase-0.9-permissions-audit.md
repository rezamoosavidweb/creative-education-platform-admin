# Phase 0.9 Permissions Audit

## Summary

The Permissions module was audited against the backend identity capability
contracts. The page remains read-gated for staff capability review, while grant
and revoke controls now require the backend manage capability.

## Backend Contracts

- `GET /identity/me/capabilities`
  - Lists the current user's effective capability keys.
- `GET /identity/users/{userId}/capabilities`
  - Lists a user's effective capability keys for staff users with
    `identity.capability.read`.
- `POST /identity/users/{userId}/capabilities`
  - Grants a capability to an admin user with `identity.capability.manage`.
- `DELETE /identity/users/{userId}/capabilities/{capability}`
  - Revokes a capability from an admin user with
    `identity.capability.manage`.

## Frontend Changes

- Split permission constants into read and manage capability requirements.
- Kept the route and user capability viewer behind `identity.capability.read`.
- Gated grant and revoke controls behind `identity.capability.manage`.
- Renamed the table action from manage to view for read-only operators.
- Added regression coverage for the distinct backend read/manage guards.

## Decision

Keep the free-form capability key input because the backend registers capability
catalog entries on demand and does not expose a supported capability catalog
endpoint. Do not invent a local catalog.
