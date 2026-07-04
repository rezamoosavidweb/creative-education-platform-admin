# Phase 0.4 Dashboard API Migration

## Summary

The Admin dashboard now uses backend-supported operational data instead of mock
business analytics. It reads the health check contract and, when the current
user has `platform.outbox.manage`, the admin outbox stats contract.

## Backend Contracts

- `GET /health`
  - Generated request: `healthCheckerControllerCheck`.
  - Used for system status, health indicators, and informational outbox backlog.
- `GET /admin/outbox/stats`
  - Generated request: `outboxAdminControllerStats`.
  - Requires the backend `platform.outbox.manage` capability.
  - Used for pending, failed, and processed outbox totals.

## Frontend Changes

- Removed random mock dashboard metrics, charts, sparklines, and recent activity.
- Added capability-aware outbox querying.
- Added loading, empty, and error states for health and outbox panels.
- Added manual refresh behavior.
- Added mapper unit tests and browser-rendered dashboard state tests.

## Decision

Do not display revenue, conversion, signup, or activity analytics on the
dashboard until the backend exposes explicit contracts for those values.
