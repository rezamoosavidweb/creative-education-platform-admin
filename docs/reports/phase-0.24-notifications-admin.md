# Phase 0.24 Notifications Administration

## Summary

The Notifications page was expanded from a current-user inbox into the complete
backend-supported notification workspace: inbox with detail lookup, preference
editing, template management, templated dispatch, and delivery maintenance.

## Implemented Capabilities

- Current-user inbox on `GET /notifications/mine` with cursor pagination,
  loading, empty, error, refresh, and detail dialog states.
- Current-user detail lookup on `GET /notifications/mine/{id}`.
- Current-user preferences on `GET/PUT /notifications/preferences/me`.
- Admin template list/create/edit/activate on
  `GET/POST/PATCH /notifications/templates`.
- Admin templated dispatch on `POST /notifications/send`.
- Admin delivery processing and dead-letter retry on
  `POST /notifications/admin/process` and
  `POST /notifications/admin/retry-dead-letters`.

## Decisions

- Kept inbox pagination on `useServerQuery` because Orval returns response
  bodies only and does not expose the `nextCursor` response header needed by
  this endpoint.
- Wrapped generated notification request functions with TanStack Query hooks
  because several generated GET operations are emitted as mutation hooks by the
  current OpenAPI/Orval output.
- Removed the static sidebar notification badge because the backend does not
  expose an unread count.

## Backend Limitations

- No mark-read, mark-all-read, dismiss, unread-count, or read-state mutation
  endpoints.
- No global notification, delivery, or dead-letter listing endpoints.
- No recipient search endpoint for dispatch; dispatch accepts a backend user
  UUID.
- No scheduled dispatch field in the exposed send DTO.
- No template deletion endpoint.

## Verification Notes

- `npm.cmd run generate:api`
- `npm.cmd run validate:api`
- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd run knip`
- `npm.cmd run format:check`
- `npm.cmd run test` with
  `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`

The default Playwright browser download was blocked by CDN regional policy, so
browser tests were run against the installed local Edge executable supported by
the Vite test config.
