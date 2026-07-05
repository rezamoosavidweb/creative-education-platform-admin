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
- Backend-supported Admin modules have been migrated or audited module by
  module. Remaining unavailable surfaces are direct-route compatible template
  pages with documented backend limitations.

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
- [x] Billing/commerce expanded with seller balances, payout requests, admin
      payout decisions, coupons, order actions, and subscription cancellation.
- [x] Notifications module migrated from mock inbox data to current-user backend
      notification inbox contracts.
- [x] Notifications administration expanded with preferences, inbox detail,
      template management, dispatch, and delivery operations.
- [x] Remaining template modules audited; unsupported mock surfaces removed from
      navigation and replaced with direct-route unavailable states.
- [x] Courses module added for current-user authored courses, public catalog
      visibility, draft creation, and owner lifecycle actions.
- [x] Learning workflows expanded within Courses for course details,
      localization, FAQs, sections, lessons, enrollment progress, playback, and
      certificates.
- [x] Events module added for discovery, organizer events, RSVPs, venues,
      lifecycle actions, attendee lookup, and creation workflows.
- [x] Community module added for current-user groups, invitations,
      collaborations, and scheduled community sessions.
- [x] Marketplace module added for service listings, open jobs, applications,
      and current-user contracts.
- [x] Reviews module added for current-user reviews, subject review lookup,
      reputation rollups, and owner edit/remove workflows.
- [x] Media module added for uploads, public asset lookup, raw access, and
      owner delete workflows.
- [x] Search module added for global faceted search, autocomplete, term
      suggestions, facets, and cursor pagination.
- [x] Posts module added for paginated post browsing, translated creation,
      detail lookup, owner access checks, and owner-only deletion.
- [x] Quality refactor completed for Marketplace, Reviews, Media, and Search.
- [x] Full-project release audit captured in
      `docs/reports/phase-0.29-release-audit.md`.

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
- [x] Billing/commerce module product-complete backend-supported workflow slice.
- [x] Notifications module compliance audit.
- [x] Notifications module product-complete backend-supported administration
      slice.
- [x] Projects/tasks/template modules: decide keep, rename, or remove based on
      backend domain fit.
- [x] Courses module initial backend-backed slice.
- [x] Learning module backend-backed course authoring, learner progress,
      playback, and certificate slice.
- [x] Events module backend-backed discovery, organizer, RSVP, and venue slice.
- [x] Community module backend-backed current-user group, invitation,
      collaboration, and group-session slice.
- [x] Marketplace module backend-backed service, job, application, and contract
      slice.
- [x] Reviews module backend-backed current-user review and subject reputation
      slice.
- [x] Media module backend-backed upload, lookup, raw access, and owner delete
      slice.
- [x] Search module backend-backed global search, suggestions, facets, and
      pagination slice.
- [x] Posts module backend-backed paginated list, translated create, detail,
      access-check, and delete slice.
- [x] Cross-module quality refactor for recently added backend-backed modules.

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
  `/subscriptions/mine`, and `/payouts/mine`, plus seller balances, payout
  requests, current-user order/subscription actions, admin payout decisions, and
  coupon management. No invoice, plan, usage, global order listing, global
  subscription listing, coupon edit/reactivate, or payout detail endpoints are
  currently exposed.
- Notifications is scoped to current-user inbox/detail, current-user
  preferences, template management, single-user templated dispatch, and delivery
  maintenance operations. Mark-read/dismiss, unread counts, global notification
  browsing, recipient search, scheduled dispatch, delivery listing, template
  deletion, and global moderation are not exposed by the backend.
- Some feature folders use older `data/` patterns; new real features should use
  `services/`, `hooks`, `schemas`, and generated API types.
- Some shared rules are documented but not yet enforced by ESLint or tests.
- Coverage expectations need a project-wide baseline after the next test pass.
- Orval config currently sanitizes non-standard backend OpenAPI metadata before
  generation; remove the sanitizer only after the backend spec validates without
  it.
- Sidebar/navigation now advertises backend-backed workflows only. Unsupported
  template routes remain direct-link compatible with clear unavailable states.
- Courses is scoped to current-user authoring plus public catalog visibility;
  no global course moderation contract exists. Course sections, lessons,
  localization, FAQs, attachments, captions, enrollment, playback, and
  certificates are implemented through backend learning contracts. Global
  enrollment listing, certificate revocation/issuance, lesson search, bulk
  reordering, and media-library selection remain blocked by missing contracts or
  adjacent UI workflows.
- Events is scoped to published discovery, current-user organizer events,
  RSVPs, attendee lookup, and venue creation. No event update/delete, global
  event moderation, venue ownership, or event pagination contracts exist yet.
- Community is scoped to current-user groups, invitations, collaborations, and
  group sessions. No global community moderation, group discovery, group update,
  invitation cancellation, session update/cancel, collaboration update/cancel,
  participant search, or backend pagination contracts exist yet.
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
- Search is scoped to backend faceted search, autocomplete, term suggestions,
  and cursor pagination. Local response normalization exists because generated
  nested search arrays currently come through as singular DTO types.
- Posts is scoped to paginated browsing, translated creation, detail lookup,
  owner access checks, and owner-only deletion. No mutable translation update,
  backend search/filtering, global moderation, publish/archive, comments,
  reactions, author lookup, or bulk action contracts exist yet.
- Learning uses local response/body normalization because generated nested
  course-detail, section, lesson, enrollment, FAQ, attachment, and caption
  fields currently come through as singular DTO types while backend contracts
  operate on arrays.
- Shared `ApiQueryState` is now the preferred non-table loading/error/empty
  wrapper for backend-backed feature screens.

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
- Keep API-state UI primitives in `src/components/api` when they are reused
  across backend-backed modules.
- Keep notification inbox pagination on `useServerQuery` while the generated
  Orval functions return response bodies only; the inbox needs the backend
  `nextCursor` response header preserved by the shared API client.
- Generated notification GET endpoints currently appear as mutation hooks, so
  feature hooks wrap the generated request functions with TanStack Query instead
  of using the generated hook names directly.
- Generated learning nested arrays currently appear as singular DTO fields, so
  the Courses service owns normalization helpers and request-body adapters until
  the backend OpenAPI schema emits array item metadata correctly.

## Pending Automation

- Enforce no direct `axios` imports outside `src/lib/api`.
- Enforce generated API schema is not manually edited.
- Enforce Orval generated output is not manually edited.
- Enforce no feature-to-feature internal imports.
- Enforce route files stay thin where practical.
- Enforce type-only imports and unused code through existing ESLint/TypeScript.
- Add coverage thresholds after the baseline is trustworthy.
