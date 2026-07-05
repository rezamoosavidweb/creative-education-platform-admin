# Phase 0.29 Release Audit

## Summary

The Admin frontend has completed backend-supported module coverage for the
current API surface. Remaining gaps are backend limitations, unsupported
template direct routes, or documented automation/documentation hardening items.

## Audit Findings

- Backend module coverage now includes auth/account sessions, identity,
  organizations, profiles, reference catalogs, commerce, notifications,
  learning, events, community, marketplace, media, reviews, search, posts, health
  dashboard signals, and metrics/outbox operational surfaces where applicable.
- `health-checker` and `metrics` are treated as operational infrastructure; the
  dashboard already surfaces backend health/outbox signals and product analytics
  remains blocked by missing analytics contracts.
- Unsupported template feature folders remain only for direct-route unavailable
  states and are not advertised in sidebar navigation.
- No direct `axios` API bypass imports were found in feature code.
- Knip reports no unused production exports for the current project
  configuration.

## Architecture Review

- New backend-backed modules use `services/`, `hooks/`, generated API models,
  feature-local tests, and shared API-state components.
- Generated GET endpoints that Orval emits as mutation hooks are wrapped with
  TanStack Query in feature hook layers.
- Local normalization remains isolated in service helpers where generated nested
  DTO shapes do not match backend array behavior.

## Remaining Technical Debt

- Several older unsupported template feature folders still exist as direct-route
  unavailable states.
- Some repeated UI patterns across large feature pages could be extracted later,
  but current duplication is intentionally local and lower risk than broad
  abstractions during backend migration.
- Automated lint rules for documented architecture conventions are still pending.
- Coverage thresholds need a deliberate baseline after the current module set is
  stable.

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
- Production-build smoke passed for `/`, `/courses`, `/community`, and `/posts`
  with HTTP 200 auth redirects, no console errors, and no failed network
  requests.
