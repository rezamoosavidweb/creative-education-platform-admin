# Phase 0.28 Posts Workspace

## Summary

The Admin app now exposes the backend-supported posts workspace for paginated
post browsing, translated post creation, post detail inspection, owner access
checks, and owner-only deletion.

## Implemented Capabilities

- Posts navigation entry and route.
- Paginated post list using backend `page`, `take`, and `order` parameters.
- Local search across the currently loaded page of post and translation fields.
- Translated post creation for English and optional Russian content.
- Post detail dialog with backend detail lookup and translation inspection.
- Owner access check using the backend update endpoint, which currently has an
  empty DTO and verifies post ownership/existence.
- Owner-only delete action with confirmation, toast feedback, and query
  invalidation.

## Decisions

- Added Posts under Discovery because the module is a content browsing and
  publishing surface rather than learning administration or system settings.
- Used generated post request functions directly in feature hooks because the
  generated GET endpoints are exposed as mutation hooks.
- Exposed the empty update contract as an access check instead of inventing edit
  behavior not supported by the backend.

## Backend Limitations

- No mutable post translation update contract is exposed; `UpdatePostDto` is
  empty and the backend update service only verifies owner access.
- Backend list service currently honors pagination and order; search/filter
  query fields are not implemented in the service.
- No global moderation, publish/archive workflow, author lookup, comments,
  reactions, or bulk actions are exposed.

## Verification Notes

- `npm.cmd run generate:api`
- `npm.cmd run validate:api`
- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd run knip`
- `npm.cmd run format:check`
- `npm.cmd run test` with
  `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`
- `npm.cmd run build`
- Posts runtime smoke on the production build completed without console errors
  or failed network requests; unauthenticated routing redirected `/posts` to
  `/sign-in?redirect=%2Fposts` with HTTP 200.
