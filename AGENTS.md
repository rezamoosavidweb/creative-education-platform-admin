# AGENTS.md

Project memory for AI agents working in the Admin frontend repository.

## Scope

This repository is the existing React/Vite admin frontend for the Creative
Education Platform. Its backend source of truth is the sibling repository
`../api`.

Current program goal: integrate this existing admin app with `../api`. Do not
build a new Admin Panel, do not create separate persona apps, and do not redesign
the UI.

## Read First

- Read `CLAUDE.md` before frontend work.
- Read `../api/CLAUDE.md` before backend-contract or API behavior work.
- For backend capability and domain language, prefer `../api/openapi.json`,
  `../api/src/modules/**`, `../api/prisma/schema.prisma`, and
  `../api/architecture/*.md`.

## Frontend Rules

- Keep the current shadcn-admin/TanStack Router architecture and Enterprise Admin
  design system.
- Reuse existing components in `src/components/` and
  `src/features/*/components/` before creating new ones.
- Do not add another UI kit, state library, router, table library, or API client
  pattern.
- Routes stay thin under `src/routes/**`; screens live in
  `src/features/<domain>/`.
- Use `Header`, `Main`, layout/sidebar components, `StatCard`, `StatusPill`,
  `ConfirmDialog`, `SelectDropdown`, and `components/data-table/*` where they fit.
- Use `react-hook-form` + `zod` + shadcn `Form` primitives for forms.
- Use TanStack Query for server state; feature services go in
  `features/<domain>/services/`, hooks in `features/<domain>/hooks/`.

## API Integration Rules

- OpenAPI is the only API source of truth: `../api/openapi.json`.
- The generated OpenAPI SDK/contract must own DTOs, enums, request bodies,
  response bodies, API method signatures, and generated error types when
  available. Do not hand-write API models or duplicate backend DTOs.
- Current generated contract file: `src/lib/api/schema.d.ts`. Regenerate with
  `pnpm generate:api-types`; never edit generated files by hand.
- Keep three clear layers: generated SDK/contract -> infrastructure
  (axios/interceptors/auth/error handling) -> application hooks.
- Business pages, buttons, menus, dialogs, and table actions must never call
  axios directly.
- Before building the API infrastructure, inspect the generated SDK/contract and
  reuse any generated functionality that overlaps with the planned layer.
- `VITE_API_URL` is the backend base URL; keep prefixes/versioning in env config.
- Auth uses RS256 JWT access + refresh tokens. Implement refresh rotation against
  `POST /auth/refresh`; do not use refresh tokens as API bearer tokens.

## Phase 0 Foundation

Before business pages, build the integration foundation:

- Add/verify one generated OpenAPI SDK/contract source and one central API
  infrastructure layer.
- Before auth implementation, inspect the backend flow completely: login, logout,
  refresh rotation, session restore, session revoke, multiple active sessions,
  current user, current organization, and current capabilities.
- Support auth login/logout/refresh, `/auth/me`, session restore, session
  list/revoke, capabilities, request cancellation, uploads, downloads,
  idempotency keys, `X-Next-Cursor`, and global API error mapping.
- Add reusable hooks only: current user, capabilities, `useCan`, API access,
  server list adapters, cursor pagination, and mutation helpers.
- Add shared API components only when missing, composing existing UI: capability
  gate, loading/error/empty states, cursor pagination, mutation form wrappers.
  Commit a shared component only with at least one real usage.
- Adapt existing DataTable/form/navigation patterns; never replace or fork
  DataTable.
- Add a dedicated `typecheck` script before feature work. The repo package
  manager remains pnpm even when task wording says `npm run ...`.

## RBAC And Navigation

- The same Admin app must serve Super Admin, Support, Moderator, Finance,
  Instructor, Organization Admin, and Studio Admin.
- Menus, routes, pages, buttons, and row actions must be capability-driven.
- `CapabilityGate` is the standard authorization primitive. Do not duplicate
  permission logic.
- Route metadata should contain `requiredCapabilities`; keep route `beforeLoad`
  guards very small.
- Backend `RoleType` currently has `USER` and `ADMIN`; personas are capability
  sets and org/profile state, not separate layouts.
- Fetch `/identity/me/capabilities` after login and expose it through a reusable
  hook/provider. Gate UI with capability keys such as `course.publish`,
  `course.sell`, `service.sell`, `jobs.post`, `org.manage`, `payout.withdraw`,
  and `identity.capability.read`.

## Backend Notes

- Backend modules include identity/auth, learning, commerce, marketplace,
  notifications, organizations, events, community, profiles, media, reviews,
  search, reference, users, posts, health, metrics, and admin outbox operations.
- OpenAPI currently has 162 paths, 194 operations, and 179 schemas.
- Backend source owns business rules, permissions, derivations, entity names, and
  terminology. Frontend must follow it.

## Commands

```bash
pnpm dev
pnpm build
pnpm lint
pnpm test
pnpm knip
pnpm format:check
pnpm generate:api-types
```

## Delivery Discipline

- Before feature implementation, produce an integration report and wait for
  approval.
- After approval, implement one logical phase at a time.
- Every phase must build, typecheck, lint, test as appropriate, and run.
- Commit after every approved logical phase.
- Keep guidance durable: update memory files only with reusable project rules,
  not temporary task notes.
