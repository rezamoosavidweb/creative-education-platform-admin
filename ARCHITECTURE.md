# Admin Frontend Architecture

This is the canonical architecture standard for the Admin frontend. Read it
before changing routes, features, API integration, state, shared components, or
tests.

## Goals

- Keep one unified Admin app. Do not create separate persona apps.
- Keep the existing React, Vite, TanStack Router, TanStack Query, shadcn/ui,
  Tailwind, and Enterprise Admin design-system stack.
- Keep the frontend a thin client over `../api`.
- Make every feature follow one predictable shape.
- Prefer generated contracts, shared helpers, tests, and lint rules over local
  invention.

## Source Of Truth Order

1. `../api/openapi.json` and backend behavior.
2. Root admin standards docs.
3. Existing shared frontend infrastructure.
4. Feature-local precedent.

If documentation and implementation disagree, update implementation to match the
documented architecture unless the documentation is clearly wrong. In that case,
fix the documentation first.

## Required Source Layout

```text
src/
  main.tsx
  routes/
  features/
    <domain>/
      index.tsx
      components/
      hooks/
      services/
      schemas/
      types/
      constants/
      utils/
      __tests__/
  components/
    ui/
    layout/
    data-table/
    api/
  hooks/
  context/
  stores/
  lib/
    api/
    auth/
    capabilities/
    forms/
    query/
  config/
  styles/
  assets/
  test-utils/
```

## Folder Responsibilities

| Folder | Responsibility |
|---|---|
| `src/routes` | TanStack Router files only. Keep thin and delegate to features. |
| `src/features/<domain>` | Domain screens and feature-scoped code. |
| `src/components/ui` | shadcn/ui primitives. Treat as generated/vendor-like. |
| `src/components/layout` | App shell, header, sidebar, navigation, authenticated layout. |
| `src/components/data-table` | Shared TanStack Table primitives and server adapters. |
| `src/components/api` | Shared loading, error, empty, and pagination UI states. |
| `src/components/*.tsx` | Shared app components used by multiple features. |
| `src/hooks` | Cross-feature hooks only. |
| `src/context` | App-wide UI providers. |
| `src/stores` | Global client stores. Auth is the only approved Zustand domain today. |
| `src/lib/api` | Generated contract entry points, API client, request helpers, and error mapping. |
| `src/lib/auth` | Token ownership, login/logout, refresh, restore, current-user hooks. |
| `src/lib/capabilities` | Capability provider, gates, route metadata, route guards, navigation filtering. |
| `src/lib/forms` | Backend-backed form helpers and API validation mapping. |
| `src/lib/query` | Shared TanStack Query wrappers, query keys, retry, cancellation, invalidation, lists. |
| `src/config` | Static app configuration. |
| `src/styles` | Tailwind entrypoint, global CSS, and design tokens. |
| `src/assets` | Static assets and app-owned icons. |
| `src/test-utils` | Test helpers only. |

Do not add new top-level `src` folders without updating this file.

## Feature Architecture

Every real feature follows this structure:

```text
src/features/courses/
  index.tsx
  components/
    courses-table.tsx
    course-status-badge.tsx
  hooks/
    use-courses-list.ts
    use-create-course.ts
  services/
    courses-query.ts
  schemas/
    course-form-schema.ts
  types/
    course-view-model.ts
  constants/
    course-filters.ts
  utils/
    course-formatters.ts
  __tests__/
    courses-query.test.ts
```

Rules:

- `index.tsx` exports the feature page component.
- `components` contains feature-only UI.
- `hooks` exposes feature use cases.
- `services` composes generated API types with shared API/query helpers.
- `schemas` contains frontend-only form or URL validation.
- `types` contains frontend-only view models and UI state.
- `constants` contains stable feature constants.
- `utils` contains pure feature helpers.
- A feature may omit folders it does not need, but may not invent alternative
  folder names for these responsibilities.

## Route Architecture

- `src/routeTree.gen.ts` is generated. Never edit it.
- Route files render feature pages and own route metadata/search validation.
- Auth and authorization logic must delegate to `src/lib/auth` and
  `src/lib/capabilities`.
- Route metadata uses backend capability keys only.

Good:

```tsx
import Courses from '@/features/courses'

export const Route = createFileRoute('/_authenticated/courses/')({
  component: Courses,
})
```

Bad: a route file that owns fetching, table state, dialogs, mutations, and page
layout itself.

## API Architecture

The API layer has exactly three layers:

1. Generated OpenAPI contract/client from `../api/openapi.json`.
2. Shared runtime infrastructure in `src/lib/api`, `src/lib/auth`, and
   `src/lib/query`.
3. Feature hooks and services in `src/features/<domain>`.

Rules:

- Orval is the approved generator for callable API clients. Generated clients,
  DTOs, enums, request bodies, response bodies, and operation types must come
  from `../api/openapi.json`.
- The current repository still has a type-only generated output at
  `src/lib/api/schema.d.ts`; treat it as an interim contract until Orval runtime
  generation is added.
- Generated code lives under `src/lib/api/generated/` once Orval is introduced.
  The existing `src/lib/api/schema.d.ts` remains generated until then.
- Handwritten wrappers, auth integration, error mapping, uploads, downloads, and
  query composition live outside generated folders in `src/lib/api`,
  `src/lib/auth`, and `src/lib/query`.
- Regenerate the current type-only contract with `pnpm generate:api-types`.
- Never edit `src/lib/api/schema.d.ts` by hand.
- Never edit Orval-generated files by hand.
- Business code must never import `axios` directly.
- Do not hand-write backend DTOs, enums, request bodies, or response bodies.
- Feature services may map backend DTOs into frontend view models.
- Auth token storage, bearer attachment, refresh, session restore, and logout
  belong only to `src/lib/auth`.
- Capability checks belong only to `src/lib/capabilities`.

## State Architecture

| State kind | Standard owner |
|---|---|
| Server state | TanStack Query through `src/lib/query` and feature hooks. |
| Auth/session state | `src/lib/auth` and `src/stores/auth-store.ts`. |
| Capability state | `src/lib/capabilities`. |
| URL state | TanStack Router search params and shared URL-state hooks. |
| Form state | `react-hook-form` plus zod. |
| Feature UI state | Local state or a feature provider. |
| Global UI preferences | Existing providers in `src/context`. |

Avoid duplicated state. Prefer derived values over synchronized state.

## Dependency Rules

- `routes` may depend on `features`, `lib`, and shared components.
- `features/<domain>` may depend on shared components, hooks, lib, context, and
  generated API types.
- Shared components must not depend on feature modules.
- `lib` must not depend on feature modules.
- Feature modules must not import sibling feature internals.
- Move cross-feature reuse to `src/components`, `src/hooks`, or `src/lib`.

## Refactor Workflow

Refactor one module at a time:

1. Read this file and `ROADMAP.md`.
2. Audit the module and record issues.
3. Refactor only that module and directly required shared primitives.
4. Remove dead code and duplicated logic in scope.
5. Add or update tests.
6. Run lint, typecheck, tests, build, dead-code checks, and format checks.
7. Update `ROADMAP.md`.
8. Commit one logical change with a Conventional Commit message.

No module is complete until checks pass or the remaining blocker is recorded in
`ROADMAP.md`.
