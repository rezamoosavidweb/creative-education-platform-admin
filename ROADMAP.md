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
- [x] Profiles module audited for directory/current-user contract fit and
      generated availability status enum controls.
- [x] Permissions module audited against identity capability read/manage
      guards.
- [x] Sessions module audited against current-user auth-session contracts.
- [x] Reference catalogs module audited against active read-only taxonomy
      contracts.
- [x] Audit logs module audited; mock data removed because no backend listing
      contract exists.
- [x] Analytics module audited; mock product analytics removed because no
      backend analytics contract exists.
- [x] Billing module migrated from mock plan/invoice UI to current-user commerce
      order, subscription, and payout contracts.
- [x] Notifications module migrated from mock inbox data to current-user backend
      notification inbox contracts.
- [x] Remaining template modules audited; unsupported mock surfaces removed from
      navigation and replaced with direct-route unavailable states.
- [x] Courses module added for current-user authored courses, public catalog
      visibility, draft creation, and owner lifecycle actions.
- [x] Events module added for discovery, organizer events, RSVPs, venues,
      lifecycle actions, attendee lookup, and creation workflows.
- [x] Marketplace module added for service listings, open jobs, applications,
      and current-user contracts.
- [x] Reviews module added for current-user reviews, subject review lookup,
      reputation rollups, and owner edit/remove workflows.
- [x] Media module added for uploads, public asset lookup, raw access, and
      owner delete workflows.

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
- [x] Profiles module compliance audit.
- [x] Permissions module compliance audit.
- [x] Sessions module compliance audit.
- [x] Reference catalogs module compliance audit.
- [x] Audit logs module compliance audit.
- [x] Analytics module compliance audit.
- [x] Billing module compliance audit.
- [x] Notifications module compliance audit.
- [x] Projects/tasks/template modules: decide keep, rename, or remove based on
      backend domain fit.
- [x] Courses module initial backend-backed slice.
- [x] Events module backend-backed discovery, organizer, RSVP, and venue slice.
- [x] Marketplace module backend-backed service, job, application, and contract
      slice.
- [x] Reviews module backend-backed current-user review and subject reputation
      slice.
- [x] Media module backend-backed upload, lookup, raw access, and owner delete
      slice.

## Known Technical Debt

- Remaining direct routes for unsupported template pages show unavailable states
  instead of mock/template data.
- The Users module is read-only because the backend currently exposes only list
  and detail endpoints for admin users.
- Identity verification admin UI is scoped to staff review actions; self-service
  profile verification requests should live outside the staff queue route.
- Organizations are membership-scoped through `/organizations/mine`; the Admin
  page is not a global organization directory.
- Profiles combines public directory search with current-user profile and
  persona management; availability status controls use backend enum values.
- Permissions is read-gated by `identity.capability.read`; grant and revoke
  controls require `identity.capability.manage`. There is no backend capability
  catalog endpoint, so capability grants stay free-form.
- Sessions is current-user auth-session management through `/auth/sessions`, not
  global admin session management or community scheduled sessions.
- Reference catalogs are active, read-only taxonomy arrays; no catalog write
  endpoints are currently exposed.
- Audit log browsing is blocked by missing backend list/export endpoints. Auth
  audit events currently go to structured logs only, so the mock Admin table was
  removed from navigation.
- Product analytics is blocked by missing backend analytics endpoints. The
  Prometheus `/metrics` scrape endpoint is operational infrastructure, not an
  Admin analytics contract.
- Billing is current-user commerce history through `/orders/mine`,
  `/subscriptions/mine`, and `/payouts/mine`; no invoice, plan, usage, or global
  billing admin endpoints are currently exposed.
- Notifications inbox uses `/notifications/mine`. Mark-read/dismiss actions are
  not exposed by the backend; notification templates, send, and delivery admin
  operations should be separate capability-gated modules.
- Some feature folders use older `data/` patterns; new real features should use
  `services/`, `hooks`, `schemas`, and generated API types.
- Some shared rules are documented but not yet enforced by ESLint or tests.
- Coverage expectations need a project-wide baseline after the next test pass.
- Orval config currently sanitizes non-standard backend OpenAPI metadata before
  generation; remove the sanitizer only after the backend spec validates without
  it.
- Sidebar/navigation now advertises backend-backed workflows only. Unsupported
  template routes remain direct-link compatible with clear unavailable states.
- Backend-supported future candidates include search, notification
  administration, revenue, coupons, and deeper learning workflows. Implement
  each as its own
  generated-contract-backed module.
- Courses is scoped to current-user authoring plus public catalog visibility;
  no global course moderation contract exists. Course sections, lessons,
  localization, FAQs, attachments, captions, enrollment, playback, and
  certificates remain future learning slices.
- Events is scoped to published discovery, current-user organizer events,
  RSVPs, attendee lookup, and venue creation. No event update/delete, global
  event moderation, venue ownership, or event pagination contracts exist yet.
- Marketplace is scoped to published service discovery, current-user service
  listings, open job discovery, submitted applications, hirer application
  review by job ID, and current-user contracts. No current-user posted jobs
  listing, marketplace update/delete, global moderation, or pagination
  contracts exist yet.
- Reviews is scoped to current-user reviews, published reviews by explicit
  subject type/UUID, and subject reputation rollups. No global moderation,
  reported-review queue, subject search, or pagination contracts exist yet.
- Media is scoped to upload, public lookup by UUID, raw asset access, and
  owner-only delete. No current-user library/listing, search, folders, signed
  playback URL creation, global moderation, or pagination contracts exist yet.

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
