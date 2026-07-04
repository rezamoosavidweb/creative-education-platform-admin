# Admin Frontend Roadmap

Future agents must start here after reading `AGENTS.md`, `CLAUDE.md`, and the
root standards docs.

## Current Status

- Phase 1 documentation baseline is complete.
- Orval runtime client generation is available.
- Existing app uses the shadcn-admin/TanStack Router template with Enterprise
  Admin styling.
- OpenAPI type generation exists at `src/lib/api/schema.d.ts`.
- Orval generation exists at `src/lib/api/generated/`.
- Shared API, auth, capabilities, query, form, server-table, and API-state
  foundations exist.
- Many business pages still use template or mock data and must be migrated
  module by module.

## Completed

- [x] Repository audit captured in `docs/reports/phase-0-repository-audit.md`.
- [x] OpenAPI foundation report captured in
      `docs/reports/phase-0.1-openapi-foundation.md`.
- [x] Canonical architecture standard added in `ARCHITECTURE.md`.
- [x] Frontend engineering standards added in `FRONTEND_GUIDELINES.md`.
- [x] Component standards added in `COMPONENT_GUIDELINES.md`.
- [x] Testing standards added in `TESTING.md`.
- [x] Performance standards added in `PERFORMANCE.md`.
- [x] `AGENTS.md` and `CLAUDE.md` aligned with the canonical docs.
- [x] Orval runtime client generation added under `src/lib/api/generated/`.
- [x] Orval mutator added to delegate generated requests to the shared
      `apiClient`.
- [x] Command palette navigation now uses the same capability filtering as the
      sidebar.
- [x] Dashboard migrated from mock business analytics to backend-backed
      operational health and outbox signals.
- [x] Users module audited against backend read-only user contracts and gated by
      `identity.user.read`.
- [x] Identity verification admin review module audited against backend queue,
      approve, and reject contracts.
- [x] Organizations module audited against current-user membership contracts and
      generated org type/role enums.

## In Progress

- [ ] Add automated lint rules for conventions that are currently documented
      only in prose.
- [ ] Audit feature modules against the canonical feature structure.

## Next Phase: Documentation Hardening

- [ ] Add a docs index if documentation grows beyond root files.
- [ ] Record architecture decisions for major frontend choices if they change.
- [ ] Convert repeated guidance from `CLAUDE.md` into references to root docs.
- [ ] Add checklists for module refactors and API-backed feature migration.

## Module Refactor Backlog

Refactor one module at a time. Do not begin the next module until the current
module passes checks or has documented blockers.

- [x] Navigation and capability-aware sidebar/command menu audit.
- [x] Dashboard real API migration.
- [x] Users module compliance audit.
- [x] Identity verification module compliance audit.
- [x] Organizations module compliance audit.
- [ ] Profiles module compliance audit.
- [ ] Permissions module compliance audit.
- [ ] Sessions module compliance audit.
- [ ] Reference catalogs module compliance audit.
- [ ] Audit logs module compliance audit.
- [ ] Analytics module compliance audit.
- [ ] Billing module compliance audit.
- [ ] Notifications module compliance audit.
- [ ] Projects/tasks/template modules: decide keep, rename, or remove based on
      backend domain fit.

## Known Technical Debt

- Several pages still use mock/template data instead of backend-backed services.
  The dashboard is no longer mock-backed.
- The Users module is read-only because the backend currently exposes only list
  and detail endpoints for admin users.
- Identity verification admin UI is scoped to staff review actions; self-service
  profile verification requests should live outside the staff queue route.
- Organizations are membership-scoped through `/organizations/mine`; the Admin
  page is not a global organization directory.
- Some feature folders use older `data/` patterns; new real features should use
  `services/`, `hooks`, `schemas`, and generated API types.
- Some shared rules are documented but not yet enforced by ESLint or tests.
- Coverage expectations need a project-wide baseline after the next test pass.
- Orval config currently sanitizes non-standard backend OpenAPI metadata before
  generation; remove the sanitizer only after the backend spec validates without
  it.
- Sidebar/navigation still contains template-era entries; command menu and
  sidebar visibility are capability-driven, but each entry still needs a
  backend-domain fit check during module migration.

## Required Module Completion Checklist

For every module:

- [ ] Analyze current implementation.
- [ ] Identify architecture, duplication, test, and performance issues.
- [ ] Refactor to documented folder and dependency rules.
- [ ] Remove dead code in scope.
- [ ] Replace mock data with generated-contract-backed API services where the
      backend endpoint exists.
- [ ] Add or update unit tests.
- [ ] Add integration or E2E coverage for user-critical flows.
- [ ] Run `pnpm lint`.
- [ ] Run `pnpm typecheck`.
- [ ] Run `pnpm test`.
- [ ] Run `pnpm build`.
- [ ] Run `pnpm knip`.
- [ ] Run `pnpm format:check`.
- [ ] Run production preview/manual verification when runtime behavior changed.
- [ ] Update this roadmap.
- [ ] Commit with a Conventional Commit message.

## Architecture Decisions

- Keep one Admin app with capability-driven UI.
- Keep TanStack Router file-based routing.
- Keep TanStack Query as the server-state layer.
- Keep `react-hook-form` plus zod as the form standard.
- Keep OpenAPI generation as the source of backend types and Orval as the
  approved runtime-client generator.
- Keep shadcn/ui, Radix, Tailwind v4, and Enterprise Admin tokens as the design
  system.

## Pending Automation

- Enforce no direct `axios` imports outside `src/lib/api`.
- Enforce generated API schema is not manually edited.
- Enforce Orval generated output is not manually edited.
- Enforce no feature-to-feature internal imports.
- Enforce route files stay thin where practical.
- Enforce type-only imports and unused code through existing ESLint/TypeScript.
- Add coverage thresholds after the baseline is trustworthy.
