# Phase 0.16 Template Modules Audit

## Scope

Audited the remaining shadcn-admin template surfaces against backend controller
contracts and generated Orval endpoints.

## Backend Fit

No supported Admin contracts currently exist for the generic template modules:

- Tasks
- Chat
- Projects
- Activity
- Roles catalog and role management
- Global teams
- API keys
- Integrations
- App marketplace
- System log browsing
- Admin monitoring charts
- Standalone security center

Related backend concepts exist, but they are not equivalent Admin contracts:

- Organization teams are scoped to `/organizations/{id}/teams`.
- Role assignment is exposed through identity user contracts, not a role catalog.
- `/health` is already consumed by the dashboard.
- `/metrics` is a Prometheus scrape endpoint, not an Admin UI contract.
- Structured logs are emitted to the logging backend and are not exposed through
  an Admin listing/export API.

## Changes

- Removed unsupported template modules from sidebar navigation.
- Replaced direct route pages with explicit unsupported-contract empty states.
- Removed obsolete mock data, template tables, cards, charts, dialogs, and tests
  tied only to unsupported surfaces.
- Left direct routes in place so bookmarked URLs fail gracefully instead of
  rendering invented data.

## Decision

Admin navigation should advertise only backend-backed workflows. Future modules
for courses, events, marketplace services, jobs, reviews, media, search,
notification administration, revenue, coupons, or other backend domains should
be implemented as separate feature migrations from the generated contracts.
