# Phase 0.15 Notifications Audit

## Summary

The Notifications module was migrated from mock inbox data to the backend
current-user notification inbox. Unsupported local actions such as mark-all-read
and dismiss were removed because the backend does not expose those contracts.

## Backend Contracts

- `GET /notifications/mine`
  - Lists the caller's notification inbox with cursor pagination.
- `GET /notifications/mine/{id}`
  - Reads one notification owned by the caller.
- `GET/POST/PATCH /notifications/templates...`
  - Admin template management guarded by notification template capability.
- `POST /notifications/send`
  - Admin templated send guarded by notification send capability.
- `POST /notifications/admin/process` and
  `POST /notifications/admin/retry-dead-letters`
  - Admin delivery operations guarded by delivery management capability.
- `GET/PUT /notifications/preferences/me`
  - Current-user notification preferences, already represented under settings.

## Frontend Changes

- Removed mock notification data and presentation-only category config.
- Removed unsupported mark-all-read, dismiss, and local filter controls.
- Added backend-backed inbox loading, empty, and error states.
- Added helper coverage for generated inbox results, statuses, and delivery
  summary behavior.

## Decision

Initial scope kept this page to the caller's inbox. This was superseded by
`docs/reports/phase-0.24-notifications-admin.md`, which adds the supported
capability-gated admin workflows to the same Notifications workspace.
