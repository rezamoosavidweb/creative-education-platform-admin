# Performance Standards

Performance work must protect real user workflows without adding unnecessary
complexity.

## Baseline Rules

- Keep route files lazy through TanStack Router auto code splitting.
- Split large feature-only dependencies by route or feature.
- Keep server data in TanStack Query, not copied into local state.
- Preserve stable table dimensions during loading and filtering.
- Prefer skeletons over layout-shifting spinners.
- Measure before adding broad memoization.

## Loading And Code Splitting

- Route-level code should load only when the route is visited.
- Use dynamic imports for expensive feature-only modules.
- Do not put heavy chart/table/form dependencies into shared startup code unless
  they are needed globally.
- Suspense fallbacks must resemble the destination surface.
- Avoid blank pages during route transitions.

## Render Performance

- Avoid unnecessary context updates. Split contexts by update frequency.
- Avoid passing unstable object/function props through large trees.
- Keep table column definitions stable when they are expensive or affect row
  renders.
- Use `useMemo`, `useCallback`, and `React.memo` only for expensive calculations,
  referential stability required by a child, or measured rerender problems.
- Do not wrap every component in memoization by default.

## Table Performance

- Server-backed tables use manual pagination, sorting, and filtering.
- Use cursor or page metadata from the API; do not fetch all rows for admin
  lists.
- Virtualize only when row count and rendering cost require it.
- Debounce text search that triggers network requests.
- Keep row actions lightweight and capability-aware.

## Network And Cache Strategy

- Use `src/lib/query` defaults for stale time, retries, cancellation, and
  invalidation.
- Query keys must include all inputs that affect results.
- Abort obsolete requests when users change filters or leave a route.
- Use optimistic updates only when rollback is reliable.
- Avoid duplicate requests across sibling components by sharing hooks or query
  keys.

## Images And Assets

- Use optimized static assets.
- Avoid importing large images into routes that do not need them.
- Prefer CSS/design tokens for simple styling over image decoration.
- Keep icons from existing libraries or app-owned assets.

## Memory Leak Prevention

Effects that subscribe to anything must clean up:

- event listeners
- intervals
- timeouts
- observers
- sockets/subscriptions
- in-flight async work where cancellation is available

Use `AbortController` or query-provided signals for requests. Do not call state
setters after a component unmounts from unmanaged async work.

## Bundle Hygiene

- Run `pnpm knip` before completing a module.
- Do not add a dependency for small utilities already covered by the platform or
  existing stack.
- Prefer feature-local imports over central imports that drag large modules into
  startup.
- Keep generated files out of lint and coverage when they are not authored code.

## Profiling Triggers

Profile before broad optimization when:

- A page renders more than one expensive table or chart.
- Typing, filtering, or resizing feels delayed.
- Context changes rerender most of the app.
- A route's initial chunk grows noticeably.
- Production build or Lighthouse-style checks show regressions.

Record significant findings or unresolved risks in `ROADMAP.md`.
