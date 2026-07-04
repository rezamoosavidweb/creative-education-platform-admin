# Phase 0.23 Quality Refactor

## Scope

Audited and refactored the recently added Marketplace, Reviews, Media, and
Search modules without adding new user-facing capability.

## Changes

- Extracted repeated loading/error/empty rendering into shared
  `ApiQueryState` under `src/components/api`.
- Replaced Marketplace and Reviews local query-state wrappers with the shared
  component.
- Added unit coverage for the shared API query-state component.
- Reused the existing cursor pagination component on Search instead of a local
  next-page button.
- Debounced Search autocomplete and term suggestions with the existing
  `useDebouncedValue` hook to avoid issuing a request on every keystroke.
- Removed an unnecessary single-item `Promise.all` from Marketplace
  invalidation.
- Improved form control labeling in Reviews, Media, and Search.

## Architectural Notes

- API state rendering now has one shared primitive for new non-table features.
- Generated API functions remain the only request layer for the audited modules.
- Search keeps feature-boundary normalization for generated nested array fields
  until backend OpenAPI metadata emits those arrays correctly.

## Remaining Debt

- Marketplace creation forms still share a generic field component with
  `react-hook-form` path casts. This avoids duplicated form markup but should be
  revisited if the forms diverge further.
- Backend contract gaps remain unchanged: no Marketplace posted-jobs listing,
  no Reviews moderation queue, no Media listing/library endpoint, and generated
  Search nested arrays still require local normalization.
