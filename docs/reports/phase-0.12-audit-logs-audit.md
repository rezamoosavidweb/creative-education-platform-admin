# Phase 0.12 Audit Logs Audit

## Summary

The Audit Logs module was audited against the backend. No supported audit-log
listing, filtering, or export endpoint exists. The previous Admin page used
mock audit records, so that unsupported data surface was removed.

## Backend Findings

- Auth audit events are recorded through `AuditService`.
- `AuditService` writes structured logger events such as `auth.login.success`,
  `auth.login.failed`, `auth.token.refreshed`, `auth.token.reuse_detected`, and
  `auth.logout`.
- The backend does not expose an HTTP endpoint to list, filter, paginate, or
  export audit events.

## Frontend Changes

- Removed mock audit-log data and the mock table.
- Removed Audit Logs from sidebar navigation so it is not advertised as a
  supported Admin feature.
- Kept the route as an explicit unavailable-state page for direct links.

## Blocker

Audit-log browsing cannot be implemented without a backend audit-log API
contract. Required backend support would need to define response DTOs, filters,
pagination, permissions, retention semantics, and export behavior.
