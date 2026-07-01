# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in the **Admin** repository.

## Project Overview

Single, unified **Admin web application** for the Creative Education Platform (a
multi-persona music/creative-education product). It is built on the
[`satnaing/shadcn-admin`](https://github.com/satnaing/shadcn-admin) template,
heavily restyled to the in-house **"Enterprise Admin"** design system
(`design_handoff_enterprise_admin/`).

**There is ONE app, not two.** Do not build a separate "Admin Panel" and
"Instructor Panel". The same UI adapts to the authenticated user via
**role + capability-based navigation** (a user can simultaneously be a learner,
instructor, practitioner/musician, studio owner, org admin, and platform admin).

**Backend is the source of truth** (`../api`). The frontend is a **thin client**:
business rules, permissions, and derivations live in the backend. Never
re-implement backend logic here, and never invent a different business model.

> **Current reality (read before planning any feature):** the app still runs on
> the template's **mock data** and **mock auth**. There is **no HTTP/API layer,
> no real login, and the sidebar is a static hard-coded list** whose pages
> (Tasks, Chat, Projects, Teams, API Keys, …) map to the *template*, not to the
> backend domains (Courses, Offerings, Orders, Jobs, Services, Events, Profiles,
> …). Making this a real thin client over `../api` is the work; see
> "Backend integration contract" and "Current state vs. target".

## Golden Rules (do / don't)

- **Keep the current UI and architecture.** Do NOT redesign, do NOT introduce a
  second design system, routing system, state library, or UI kit.
- **Reuse before creating.** Search `src/components/` and `src/features/*/components`
  first. Only build a component when none fits, and build the smallest reusable one.
- **Thin client.** Drive routing, menus, page visibility, and actions from backend
  **capabilities + role**, not from hard-coded assumptions.
- **Match surrounding code.** Mirror existing file names, folder shape, imports,
  and Tailwind/token usage. Minimize churn and duplication; avoid over-engineering.
- **The API contract is `../api/openapi.json`.** Treat DTOs there as authoritative
  request/response shapes. Do not hand-write types that drift from it.

## Package Manager & Commands

Use **pnpm**. (Node/Vite project — unrelated to the API's runtime.)

```bash
pnpm dev            # Vite dev server
pnpm build          # tsc -b && vite build (type-check + production build)
pnpm lint           # ESLint (flat config)
pnpm format         # Prettier write · pnpm format:check to verify
pnpm knip           # dead-code / unused-dependency check
pnpm test           # Vitest (browser mode, headless Playwright/Chromium)
pnpm test:watch     # Vitest watch
```

### Frontend gauntlet (run after every commit)

All must pass:

```bash
pnpm lint && pnpm build && pnpm test && pnpm knip && pnpm format:check
```

`pnpm build` runs `tsc -b`, so it is also the type-check gate. Browser tests need
Chromium once: `pnpm test:browser:install`.

## Tech Stack

| Area | Choice |
|---|---|
| Framework | **React 19** + TypeScript (strict), Vite 8, ESM |
| Routing | **TanStack Router** (file-based, `autoCodeSplitting`, generated `routeTree.gen.ts`) |
| Server state | **TanStack Query v5** |
| Client/UI state | **Zustand** (auth) + **React Context** (theme/font/direction/layout/search + per-feature) |
| Tables | **TanStack Table v8** |
| Forms | **react-hook-form** + **zod v4** (`@hookform/resolvers`) |
| UI kit | **shadcn/ui** (new-york style) on Radix + **Tailwind v4** |
| Charts | **Recharts** · Icons: **lucide-react** (+ brand icons in `src/assets/brand-icons`) |
| HTTP | **axios** (installed; only used today by error handling — no client yet) |
| Toasts | **sonner** · Dates: **date-fns** |
| Auth (optional demo) | **Clerk** (`@clerk/react`) — a separate `routes/clerk/*` tree, not the primary path |
| Tests | **Vitest** browser mode + Playwright/Chromium; `vitest-browser-react` |
| Lint/format | **ESLint** (flat) + **Prettier** (with import sorting) |

## Architecture & Folder Conventions

`@` is aliased to `src/` (see `vite.config.ts`, `tsconfig`, `components.json`).

```text
src/
├── main.tsx                 # App entry: QueryClient + providers + RouterProvider
├── routes/                  # TanStack Router file-based routes (thin; delegate to features/)
│   ├── __root.tsx           # Root route (devtools, toaster, nav progress, error/404)
│   ├── _authenticated/      # Authenticated layout segment + one file per page
│   ├── (auth)/ (errors)/    # Route groups (parentheses = no URL segment)
│   └── clerk/               # Optional Clerk demo tree (not the primary auth path)
├── features/<domain>/       # One folder per feature/domain — the real screens live here
│   ├── index.tsx            # Page component (composed of Header + Main + content)
│   ├── components/          # Feature-scoped components
│   ├── data/                # ⚠️ Mock data + zod schemas (template leftover; replace w/ API)
│   ├── types/               # Feature types
│   ├── services/            # Data-access layer (react-query queryFns) — see dashboard
│   └── hooks/               # Feature hooks (e.g. useDashboardData)
├── components/
│   ├── ui/                  # shadcn/ui primitives — treat as generated (see below)
│   ├── layout/              # App shell: sidebar, header, nav-*, main, authenticated-layout
│   ├── data-table/          # Reusable TanStack Table toolkit (toolbar/pagination/…)
│   └── *.tsx                # Shared app components (stat-card, status-pill, confirm-dialog, …)
├── context/                 # App-wide providers (theme/font/direction/layout/search)
├── stores/                  # Zustand stores (auth-store.ts)
├── hooks/                   # Cross-feature hooks (use-table-url-state, use-dialog-state, use-mobile)
├── lib/                     # utils (cn, sleep, pagination, initials), cookies, handle-server-error, avatar
├── config/                  # fonts
├── styles/                  # index.css (Tailwind + base) + theme.css (design tokens)
└── test-utils/              # Vitest helpers
```

**Two feature-structure variants exist.** Older template features (`users`,
`tasks`) use `data/` (mock) + `data/schema.ts` (zod) + a `*-provider` + table +
dialogs. Newer ones (`dashboard`) use the cleaner **`services/` + `hooks/` +
`types/`** shape. **Prefer the `services/`+`hooks/` shape for new/real features**,
with `services/` holding the axios+react-query calls to `../api`.

### Feature boundaries

- One `features/<domain>/` folder per screen; **name domains to mirror backend
  modules** (`courses`, `offerings`, `orders`, `jobs`, `services`, `events`,
  `profiles`, `notifications`, …) rather than template names.
- Keep cross-feature reuse in `src/components/`, `src/hooks/`, `src/lib/`.
- Routes stay thin — a `routes/**/index.tsx` should import and render a
  `features/<domain>` export and (where needed) declare the search-param schema.

## Routing

- **File-based** via `@tanstack/router-plugin`; **`src/routeTree.gen.ts` is
  generated — never hand-edit** (regenerated by the dev server / build).
- Folders in parentheses are **route groups** (`(auth)`, `(errors)`) — grouping
  without a URL segment. `_authenticated` is a **layout route**: its
  `route.tsx` renders `AuthenticatedLayout`; pages live under it.
- Pages read/write URL search params via the route API
  (`getRouteApi('/_authenticated/users/')`, `route.useSearch()`,
  `route.useNavigate()`), which powers URL-synced tables.
- `main.tsx` wires the `QueryClient` into router context and handles global
  query errors (401 → reset auth + redirect to `/sign-in`; 500 → `/500`).
- **Auth guarding is currently a no-op** (`_authenticated/route.tsx` renders the
  layout without checking auth). A real `beforeLoad` guard is part of the target.

## State Management

- **Server state → TanStack Query.** Query keys are arrays namespaced by domain
  (`['dashboard','stats',filters]`). Wrap calls in a feature `services/` module
  and expose them through a feature `hooks/` file.
- **Auth → Zustand** (`stores/auth-store.ts`): `{ auth: { user, accessToken,
  setUser, setAccessToken, resetAccessToken, reset } }`, persisted to a cookie.
  ⚠️ Today it stores a **mock token**; the token key/name is a placeholder.
- **UI/feature-local → React Context**: global providers in `context/`;
  per-feature dialog/selection state via a `*-provider.tsx` + `use<Feature>()` hook.

## API Layer

**Current:** none. Only `lib/handle-server-error.ts` (axios error → toast) and
`main.tsx`'s QueryCache 401/500 handling exist. Every feature imports local mock
data from its `data/` folder.

**Target pattern (build this, don't scatter fetch calls):**

1. A single axios instance in `src/lib/` (e.g. `api-client.ts`): `baseURL` from
   `import.meta.env.VITE_API_URL`, request interceptor attaching
   `Authorization: Bearer <accessToken>` from the auth store, response
   interceptor performing **refresh-token rotation** on 401 (`POST /auth/refresh`)
   then retry, and surfacing errors through the existing `handleServerError`.
2. **Types from the contract.** Generate/derive request/response types from
   `../api/openapi.json` rather than hand-authoring divergent interfaces.
3. Per-domain `features/<domain>/services/*.ts` with typed functions that call the
   client; per-domain `hooks/*.ts` wrapping them in `useQuery`/`useMutation`.
4. Keep the existing query defaults (retry/staleTime) from `main.tsx`.

Add `VITE_API_URL` to `.env.example` (currently it only holds
`VITE_CLERK_PUBLISHABLE_KEY`).

## Backend Integration Contract

Base API `../api` (NestJS). Auth = **JWT RS256, access + refresh (Bearer)**.

Key endpoints (see `../api/openapi.json` — 162 paths, tags: `admin, auth,
commerce, community, directory, events, health, identity, learning, marketplace,
media, notifications, organizations, posts, profiles, reference, reviews, search,
users`):

- **Auth:** `POST /auth/login`, `/auth/register`, `/auth/refresh` (rotates),
  `/auth/logout`, `GET /auth/me`, `GET /auth/sessions`, password + email/phone
  verification, `auth/external/{provider}` (Telegram/WhatsApp/etc.).
- **Capabilities:** `GET /identity/me/capabilities` → `{ capabilities: string[] }`.
  Admin grant/revoke: `POST|DELETE /identity/users/{userId}/capabilities[...]`.
  Account admin: `PATCH /identity/users/{userId}/role`, `.../suspend|deactivate|reactivate`.
- **Domains** (representative): learning `courses`, `courses/{id}/sections|lessons|enroll|publish`, `certificates`;
  commerce `offerings`, `orders`, `coupons`, `subscriptions`, `payouts`, `revenue`, `contracts`;
  marketplace `jobs`, `services`, `collaborations`; community `groups`, `posts`, `reviews`, `reputation`;
  events `events`, `venues`; `profiles/me/{instructor|practitioner|studio|portfolio}` + verification queue;
  plus `media`, `notifications`, `reference`, `search`, `directory`, `organizations`.

### Capability & authorization model (drives the UI)

- **Roles (`RoleType`) are infra-only:** `USER`, `ADMIN`. Never branch business
  features on role — use capabilities.
- **Capabilities** are namespaced `domain.action` keys (e.g. `course.publish`,
  `course.sell`, `service.sell`, `jobs.post`, `org.manage`, `payout.withdraw`,
  `identity.capability.read`), **deny-by-default**, GRANTED or DERIVED
  (e.g. verified instructor ⇒ `course.publish`). See
  `../api/architecture/09-capability-authorization-model.md`.
- **Frontend usage:** fetch `/identity/me/capabilities` once after login (cache in
  react-query / expose via a `useCapabilities()` hook), then gate **sidebar items,
  routes, and action buttons** on capability keys (and `RoleType.ADMIN` for
  platform-admin surfaces). Plain authenticated actions (enroll, comment, follow)
  need no capability.

## Component Library (shadcn/ui)

- Primitives live in `src/components/ui/` (new-york style, Radix-based). **Treat
  them as generated**: `eslint` ignores this folder and coverage excludes it.
  Some are **customized** (RTL / tweaks) — see `README.md`'s list
  (`scroll-area`, `sonner`, `separator`, and RTL-updated `alert-dialog`,
  `calendar`, `command`, `dialog`, `dropdown-menu`, `select`, `table`, `sheet`,
  `sidebar`, `switch`). Prefer manual merges over blindly re-running the CLI.
- Add new primitives via `npx shadcn@latest add <name>` (config in
  `components.json`, aliases `@/components/ui`, `@/lib/utils`, `@/hooks`).

### Shared app components (reuse these)

`stat-card` (KPI card), `status-pill` (semantic tinted badge), `confirm-dialog`,
`select-dropdown`, `date-picker`, `long-text`, `password-input`, `command-menu`
(⌘K), `search`, `theme-switch`, `config-drawer`, `profile-dropdown`,
`coming-soon`, `skip-to-main`, `navigation-progress`. Layout shell in
`components/layout/`; table toolkit in `components/data-table/`.

## Design System

- **Tokens in `src/styles/theme.css`** as CSS variables, light + `.dark`. Two
  layers: shadcn tokens (`--primary`, `--muted`, `--sidebar-*`, …) mapped to the
  Enterprise palette, **and** raw design tokens used directly in JSX via
  arbitrary values: surfaces `--sur/--sur2/--sur3/--sur4`, borders `--bdr/--bdr2`,
  text `--t1/--t2/--t3`, brand `--pri/--prih/--pris`, and semantic
  `--ok/--warn/--err/--info` each with a soft `*s` tint. Example:
  `text-[var(--t2)]`, `bg-[var(--sur)]`, `border-[var(--bdr)]`.
- **Use tokens, not raw hex.** Prefer `StatusPill`/`StatCard` tones over ad-hoc colors.
- Fonts: **Inter** (body) + **Manrope**; mono per design is JetBrains Mono for IDs.
  Radius base `0.625rem`. Theme/font/direction are user-switchable (providers below).
- **Design source of truth:** `design_handoff_enterprise_admin/`
  (`README.md`, `design-tokens.md`, `component-patterns.md`, `page-specs.md`,
  and the `.dc.html` prototypes). Match it pixel-wise; do not invent new visuals.

## Layouts

- `components/layout/authenticated-layout.tsx` — the shell: `SearchProvider` →
  `LayoutProvider` → `SidebarProvider` + `AppSidebar` + `SidebarInset` (+ `Outlet`).
- `components/layout/header.tsx` (`<Header fixed>`, breadcrumb + `SidebarTrigger`
  + actions) and `components/layout/main.tsx` (`<Main>` content container, `fixed`
  / `fluid` options, `@container/content` queries). A page composes
  `<Header/>` + `<Main>…</Main>`.
- `features/auth/auth-layout.tsx` — the unauthenticated (sign-in/up) layout.

## Providers

Global (wired in `main.tsx` + `authenticated-layout.tsx`): `ThemeProvider`,
`FontProvider`, `DirectionProvider` (RTL), `LayoutProvider`
(`useLayout()` — sidebar variant/collapsible, cookie-persisted), `SearchProvider`
(⌘K). Per-feature providers follow the `*-provider.tsx` + `use<Feature>()` pattern.

## Common Hooks

- `hooks/use-table-url-state.ts` — **the** table state hook: syncs pagination /
  global filter / column filters to URL search params (with serialize/deserialize
  + `ensurePageInRange`). Use it for every list screen.
- `hooks/use-dialog-state.tsx` — open/close dialog state (used by feature providers).
- `hooks/use-mobile.tsx` — responsive breakpoint helper.

## Table Pattern

List screens follow: **route search schema** → page reads `useSearch()` +
`useNavigate()` → `<FeatureTable data search navigate>` → inside, `useTableUrlState(...)`
+ `useReactTable(...)` with `components/data-table` pieces (`DataTableToolbar` with
`searchKey`/`filters`, `DataTablePagination`, `DataTableColumnHeader`,
`DataTableBulkActions`) → columns in `components/<feature>-columns.tsx` → row/bulk
actions + a `*-provider` driving dialogs. Reference: `features/users/`. Surfaces use
`bg-card` rows on `bg-muted` headers. For real data, feed the table from a
react-query hook instead of the `data/` mock array; move filtering/pagination
server-side when the endpoint supports it.

## Form Pattern

**react-hook-form + zod + shadcn `Form`.** Define a `formSchema = z.object(...)`,
`useForm({ resolver: zodResolver(formSchema), defaultValues })`, render with
`<Form>`/`<FormField>`/`<FormItem>`/`<FormControl>`/`<FormMessage>`; use
`<SelectDropdown>` for selects and `<PasswordInput>` for passwords. Reference:
`features/auth/sign-in/components/user-auth-form.tsx` and
`features/settings/*/**-form.tsx`. For real writes, submit via a react-query
`useMutation` calling a `services/` function (not the template's mock `sleep`).

## Naming Conventions & Coding Rules

- **File names: `kebab-case`** (`stat-card.tsx`, `use-table-url-state.ts`).
  Components `PascalCase`, hooks `useX`, variables/functions `camelCase`.
- **Relative imports have NO file extension** here (`from './header'`) —
  this is a Vite/browser app. ⚠️ Do **not** copy the API repo's `.ts`-extension
  ESM rule into this codebase.
- **`import type` for type-only imports** — ESLint enforces
  `consistent-type-imports` with inline type imports.
- **No `console.*`** — `no-console` is an error (use `sonner` toasts / devtools).
- **No unused vars** (prefix intentional throwaways with `_`); **no duplicate imports**.
- Use the `@/` alias for `src` imports. Prettier sorts imports
  (`@trivago/prettier-plugin-sort-imports`) + Tailwind class sorting — run
  `pnpm format` before committing.
- `pnpm knip` must stay clean — remove dead exports/files rather than leaving them.

## Testing

- **Vitest in browser mode** (headless Playwright/Chromium). Tests are colocated
  as `*.test.ts(x)` next to source. `vitest-browser-react` for component tests;
  helpers in `src/test-utils/`.
- `src/components/ui/**`, `assets/**`, `routes/**`, and generated files are
  excluded from coverage. Add tests for real logic (services, hooks, forms),
  not for shadcn primitives.

## Current State vs. Target (the migration this repo is doing)

| Concern | Current (template) | Target (thin client over `../api`) |
|---|---|---|
| Data | Mock `features/*/data/*.ts` + mock `services` (setTimeout) | axios + react-query against real endpoints |
| Auth | Fake login (`user-auth-form` `sleep` + mock token) | `POST /auth/login`, Bearer + refresh rotation, real store |
| Route guard | `_authenticated/route.tsx` renders unconditionally | `beforeLoad` auth guard + capability guards |
| Navigation | Static `components/layout/data/sidebar-data.ts` | Generated from role + `/identity/me/capabilities` |
| Screens | Template pages (Tasks/Chat/Projects/Teams/API Keys/…) | Backend domains (Courses/Offerings/Orders/Jobs/Services/Events/Profiles/…) |
| Types | Hand-written per feature | Derived from `../api/openapi.json` |

When implementing: reuse the existing shell, components, tokens, table/form
patterns; add the missing API/auth/capability plumbing; and replace template
screens with domain screens **incrementally**, committing per logical increment
and running the frontend gauntlet after each commit.
