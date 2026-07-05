# Phase 0.27 Community Workspace

## Summary

The Admin app now exposes the backend-supported community workspace for
current-user groups, invitations, collaborations, and scheduled community
sessions.

## Implemented Capabilities

- Community navigation entry and route.
- Current-user group list with search, member lookup, invite, leave, and
  disband actions.
- Pending invitation list with accept and decline actions.
- Current-user collaboration list with search and collaboration creation.
- Current-user community session list with search and session scheduling.
- Forms with generated DTO-backed validation, loading states, empty states,
  error states, toasts, and confirmation dialogs.

## Decisions

- Added Community as a separate Learning navigation item because `/sessions`
  already owns account-security sessions and the community module’s sessions
  are group learning/collaboration sessions.
- Wrapped generated community request functions with feature hooks because
  several generated GET endpoints are exposed as mutation hooks.
- Kept user selection as explicit UUID entry because the backend does not expose
  a community participant search endpoint.

## Backend Limitations

- No global community moderation, group discovery, group update, invitation
  cancellation, session update/cancel, collaboration update/cancel, or
  participant search endpoints are exposed.
- Group/session/collaboration lists are current-user scoped and do not expose
  backend pagination, filtering, or sorting controls.

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
- Community runtime smoke on the production build completed without console
  errors or failed network requests; unauthenticated routing redirected
  `/community` to `/sign-in?redirect=%2Fcommunity` with HTTP 200.
