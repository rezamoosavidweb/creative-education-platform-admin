# Frontend Guidelines

These rules define how day-to-day frontend work is done in the Admin app.

## Naming

| Item | Convention | Example |
|---|---|---|
| Folders | kebab-case | `identity-verification` |
| Component files | kebab-case | `verification-queue-table.tsx` |
| Hook files | kebab-case starting with `use` | `use-verification-queue.ts` |
| Utility files | kebab-case | `format-currency.ts` |
| Test files | subject plus `.test.ts(x)` | `api-validation.test.ts` |
| Components | PascalCase | `VerificationQueueTable` |
| Hooks | camelCase starting with `use` | `useVerificationQueue` |
| Functions | camelCase verb phrase | `formatUserName` |
| Variables | camelCase noun phrase | `currentUser` |
| Types | PascalCase | `VerificationStatus` |
| Interfaces | PascalCase only when extension/implementation is useful | `TableAdapterOptions` |
| Enums | Avoid handwritten enums; use generated unions or `as const` maps | `const STATUS_LABELS = {...}` |
| Constants | UPPER_SNAKE_CASE for app-wide constants, camelCase for local constants | `DEFAULT_PAGE_SIZE` |
| Contexts | PascalCase with `Context` suffix | `CapabilityContext` |
| Providers | PascalCase with `Provider` suffix | `CapabilityProvider` |

## Exports

- Prefer named exports for reusable components, hooks, utilities, constants, and
  types.
- Default exports are allowed for route files and feature page entry points
  where the router/template already expects them.
- Barrel files are allowed only at package or folder boundaries that are already
  stable, such as `src/lib/api/index.ts` or `src/components/data-table/index.ts`.
- Do not create deep barrel chains.
- Do not export test helpers from production barrels.
- Avoid `export *` when it hides ownership or creates cycles.

## TypeScript

- Keep `strict` TypeScript clean.
- Avoid `any`. If a type is unknown, use `unknown` and narrow it.
- Prefer generated OpenAPI types for backend DTOs.
- Prefer inference for obvious local values.
- Add explicit return types for exported functions, hooks with non-obvious
  returns, API helpers, and shared utilities.
- Shared types have one owner. Do not duplicate a type in multiple features.
- Use `import type` for type-only imports.
- Do not silence type errors with assertions unless the boundary is documented
  and tested.

## React

- Components should be small, named, and responsibility-driven.
- Compose components through props and children before reaching for context.
- Effects are for synchronization with external systems, not for deriving render
  values.
- Keep dependency arrays honest. Do not suppress hook lint rules.
- Use refs for DOM access and imperative integration, not for hidden state that
  should render.
- Controlled form fields go through `react-hook-form` where validation or submit
  behavior exists.
- Context values must be stable when they update frequently.
- Avoid deeply nested render trees by extracting meaningful subcomponents.

## State

- Use local state for local UI toggles and transient component state.
- Use URL state for pagination, filters, search, tabs, and anything the user may
  refresh, share, or navigate back to.
- Use TanStack Query for server state.
- Use context for app-wide UI preferences or feature-local coordination.
- Use Zustand only for approved global client state.
- Do not copy server data into local state unless editing a form draft.
- Do not synchronize two sources of truth manually.

## API Usage

- OpenAPI is the single source of truth.
- Orval is the approved generator for callable clients once generated runtime
  clients are introduced.
- `src/lib/api/schema.d.ts` is generated and must not be edited.
- Future Orval output belongs in `src/lib/api/generated/` and must not be
  edited.
- Runtime calls go through `src/lib/api`.
- Feature server state goes through `src/lib/query` helpers and feature hooks.
- Business components do not call `apiRequest`, `axios`, or generated transport
  functions directly when a feature hook can own the use case.
- Handle cancellation by passing through query/mutation signals where available.
- Map API validation errors with `src/lib/forms`.

## Forms

- Standard stack: `react-hook-form`, zod, shadcn `Form` primitives.
- Backend-backed forms use `useApiForm` and API validation helpers.
- Validation belongs in `schemas` when frontend-only.
- Submission state must disable unsafe duplicate actions.
- Show field-level validation near the field and form-level failures near the
  submit area or through the established toast pattern.
- Use optimistic UI only when rollback is clear and tested.

## Loading UX

Every async surface must define loading, empty, error, and success states.

- Prefer skeletons over spinners for pages, cards, tables, dialogs, and lists.
- Do not render blank pages while data loads.
- Tables must preserve column layout while loading.
- Dialogs must show pending submit state.
- Route-level lazy loading should use Suspense fallbacks that match the target
  surface.

## Error Handling

- Route failures use route error boundaries or the existing error pages.
- API failures use `ApiError` mapping and shared error UI.
- Validation errors map to fields when possible.
- Unauthorized states go through auth restore/logout flows.
- Forbidden states use capability route handling.
- Retry only when the action is safe and the user can understand the result.
- Use toasts for brief action results, not as the only place for critical page
  errors.

## Accessibility

- Use semantic HTML before ARIA.
- Interactive controls must be keyboard reachable.
- Dialogs, popovers, menus, and sheets must manage focus.
- Icon-only buttons need accessible labels or tooltips plus labels where
  appropriate.
- Form inputs need labels, descriptions, and error associations.
- Do not communicate state by color alone.
- Preserve visible focus styles.

## Styling

- Use Tailwind v4 and existing design tokens in `src/styles`.
- Use shadcn/ui primitives and existing shared components first.
- Keep card radius at the existing system value unless the primitive defines it.
- Do not introduce another UI kit or styling system.
- Prefer variants for repeated component states.
- Keep layouts responsive with explicit constraints for tables, boards,
  toolbars, and fixed-format controls.
- Do not use viewport-width font scaling.
- Do not add decorative gradients, blobs, or unrelated visual treatments to
  operational admin screens.

## Clean Code

- Keep functions focused and named for the business action they perform.
- Keep components below roughly 200 lines; split sooner when responsibilities
  separate.
- Keep functions below roughly 50 lines unless the structure is simpler than a
  forced split.
- Avoid nesting beyond three levels in ordinary UI logic.
- Prefer guard clauses over large conditional blocks.
- Add abstractions only when they remove real duplication or clarify ownership.
- Delete dead code in the same module when replacing behavior.

## Enforceable Rules

When a documented rule can be automated, prefer enforcement:

- ESLint for import, hook, export, and unsafe TypeScript rules.
- TypeScript for contract and nullability checks.
- Tests for behavior and regression prevention.
- Knip for dead code.
- Prettier for formatting.

New conventions should include automation when practical.
