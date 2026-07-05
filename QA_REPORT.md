# Admin Production Acceptance QA Report

Date: 2026-07-05

## Environment

- PostgreSQL container: running and healthy on `localhost:5432`.
- Existing backend container: running on `localhost:3000`, but its containerized Prisma connection points at `127.0.0.1:5432` from inside the container and cannot reach Postgres for write flows.
- Local backend API: started on `localhost:3001` with `RBAC_ENABLED=true`, `STAFF_AUTH_ENABLED=true`, and CORS for `localhost:5173`.
- Admin frontend: started on `localhost:5173` with `VITE_API_URL=http://localhost:3001`.
- Migrations: `prisma migrate deploy` reported no pending migrations.
- Generated clients: Prisma and Admin Orval clients regenerated.
- Acceptance users:
  - `acceptance.admin@example.test` / `AcceptPass123!`
  - `acceptance.user@example.test` / `AcceptPass123!`

## Browser Coverage

- Signed in through the UI as the acceptance admin.
- Verified dashboard, users, organizations, profiles, identity verification, reference, events, marketplace, billing, courses, community, posts, and notifications routes.
- Verified user search on the Users page.
- Signed in through the UI as the restricted user.
- Verified RBAC behavior: restricted user receives 403 for Users and Identity Verification, while allowed modules remain accessible.
- Verified the Events route no longer crashes.
- Verified Posts no longer performs unsupported admin-only requests; admins see a backend-limitation state, while user accounts can access the Posts workflow.

## Fixes Applied

- Removed a hidden form-context dependency from `SelectDropdown`, fixing the Events page crash.
- Prevented login from exposing an authenticated session before capabilities finish loading, fixing capability-route guard races.
- Enabled Orval index-file generation so regenerated clients include the model barrel expected by generated endpoint files.
- Added role-aware Posts query gating because backend Posts endpoints are `USER`-only.
- Added auth regression coverage for the login capability-loading state.

## Verification

Passed:

- `pnpm run generate:api`
- `pnpm run validate:api`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm run knip`
- `pnpm run format`
- `pnpm build`
- Runtime API health check
- Browser acceptance smoke with installed system Chrome

Blocked:

- `pnpm test` / Vitest browser suite cannot run because Playwright's managed Chromium download is blocked by the CDN for this network region with HTTP 403. System Chrome is installed and was used for manual browser acceptance.

## Remaining Technical Debt

- Local acceptance should run the API with RBAC enabled; the backend default keeps `RBAC_ENABLED=false` for migration safety, which returns only direct capability grants.
- The Docker API container should not use a host-loopback `DATABASE_URL` when running inside Docker.
- Playwright managed browser installation needs an allowed mirror/cache for this environment.
- Posts remain user-role scoped by backend contract; global/admin post moderation is still unsupported.
