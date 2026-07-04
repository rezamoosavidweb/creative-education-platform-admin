# Component Guidelines

Components must have one clear responsibility and one clear home.

## Component Categories

| Category | Location | Purpose |
|---|---|---|
| UI primitive | `src/components/ui` | shadcn/Radix primitives with variants and no business logic. |
| Shared app component | `src/components` | Reusable app-level pieces used by multiple features. |
| Layout component | `src/components/layout` | Shell, sidebar, header, navigation, main content frame. |
| Data-table component | `src/components/data-table` | Generic table controls, pagination, filters, server-table adapters. |
| API state component | `src/components/api` | Loading, error, empty, cursor pagination, async wrappers. |
| Feature component | `src/features/<domain>/components` | UI that belongs to one feature domain. |
| Form component | Feature folder or shared only when reused | Form fields, form sections, submit controls. |
| Dialog/sheet component | Feature folder or shared primitive | Focus-managed modal workflows. |
| Container component | Feature folder | Coordinates data, permissions, state, and presentational children. |
| Presentational component | Feature or shared folder | Renders data from props without fetching or owning business state. |

## Responsibility Rules

- A component should fetch data, manage workflow state, or render a visual unit;
  avoid doing all three at once.
- Page components compose layout and feature sections.
- Container components call hooks and pass prepared data down.
- Presentational components receive props and emit events.
- Shared components must be domain-neutral.
- Feature components may use domain language.
- Dialogs own their open/close workflow but not duplicated API logic.
- Table components use shared table primitives and feature columns/actions.

## Presentational Components

Use for visual pieces such as badges, cards, rows, and summaries.

Rules:

- No server calls.
- No route navigation unless it is the component's explicit purpose.
- No auth token or capability lookup unless rendering an authorization wrapper.
- Props should be small and named after UI needs.
- Derive labels and display formatting before passing props when it improves
  reuse.

## Container Components

Use when a feature section needs data, permissions, mutations, or coordinated
state.

Rules:

- Use feature hooks rather than raw API/query calls.
- Keep render output shallow.
- Pass only prepared props to presentational children.
- Keep mutation side effects centralized.

## Shared Components

Before adding a shared component, verify at least two real use cases or one clear
platform primitive need.

Rules:

- Do not depend on feature modules.
- Do not contain backend-domain assumptions.
- Accept labels, slots, render props, or typed configuration instead of hardcoded
  feature copy.
- Include tests when behavior is more than static rendering.

## Layout Components

Rules:

- Keep navigation capability-aware through `src/lib/capabilities`.
- Do not fetch feature data in the shell.
- Keep sidebar/header data structures shared between sidebar, breadcrumbs, and
  command menu.
- Preserve responsive and keyboard behavior.

## Form Components

Rules:

- Use `react-hook-form`, zod, and shadcn `Form` primitives.
- Backend-backed submit flows use `src/lib/forms`.
- Field components should be reusable only when they are truly domain-neutral.
- Disable submit while pending.
- Keep destructive actions explicit and confirmable.

## Dialog Components

Rules:

- Use existing shadcn dialog, alert-dialog, sheet, or drawer primitives.
- Manage focus through the primitive.
- Keep close behavior predictable after success, cancel, and error.
- Do not hide validation errors inside toasts only.
- Destructive dialogs must clearly name the affected entity.

## Table Components

Rules:

- Use `src/components/data-table` primitives.
- Server-backed tables use server adapters, manual pagination, manual sorting,
  and URL-synced filters.
- Column definitions belong in the feature unless they are generic table
  infrastructure.
- Row actions must respect capability gates.
- Bulk actions must handle empty selection, pending state, and partial failures.

## Size And Complexity

- Split components when they combine unrelated concerns.
- Avoid "God Components" that own page layout, fetching, tables, forms, dialogs,
  and mutations in one file.
- Avoid prop drilling through more than two layers; use composition or a
  feature-local provider.
- Do not add context to avoid passing one or two props.
- Memoization is not a design pattern. Add `memo`, `useMemo`, and `useCallback`
  only when a measured or obvious stability requirement exists.

## File Naming Examples

Good:

- `users-table.tsx`
- `users-delete-dialog.tsx`
- `use-users-list.ts`
- `course-status-badge.tsx`
- `server-data-table.tsx`

Bad:

- `UserComponents.tsx`
- `helpers.tsx` for UI
- `common.tsx`
- `index-components.tsx`
- `new-dialog.tsx`

## Test Expectations

Add tests for:

- Forms with validation and submit behavior.
- Dialogs with success, cancel, and error states.
- Tables with pagination, filtering, sorting, and row actions.
- Shared components with branching behavior.
- Capability-gated controls.

Static visual wrappers do not need isolated tests unless they prevent a known
regression.
