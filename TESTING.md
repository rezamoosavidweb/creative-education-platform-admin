# Testing Standards

No refactor is complete without tests that match its risk.

## Test Stack

- Vitest browser mode with Playwright/Chromium.
- React tests through `vitest-browser-react`.
- Coverage through `pnpm test:coverage`.
- Shared helpers live in `src/test-utils`.

## Required Checks

Run the relevant fast checks during development and the full gauntlet before a
module is complete:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm knip
pnpm format:check
```

`pnpm build` also runs TypeScript project references. Browser tests require
Chromium once with `pnpm test:browser:install`.

## What To Test

| Change type | Minimum coverage |
|---|---|
| Pure utility | Unit tests for normal, edge, and invalid inputs. |
| API helper | Success, API error, validation error, cancellation, and auth-sensitive behavior when relevant. |
| Query hook/service | Query key, request mapping, result mapping, error behavior, invalidation. |
| Form | Validation, submit payload, pending state, API validation mapping, success/error behavior. |
| Dialog/sheet | Open, cancel, confirm, pending, success, error, focus-sensitive behavior when relevant. |
| Table | Pagination, sorting, filtering, empty/loading/error states, row and bulk actions. |
| Capability logic | Allowed, denied, missing capability, route/nav filtering. |
| Route/page | Render the feature entry and important states; avoid duplicating every child unit test. |

## Test Placement

- Prefer colocated `*.test.ts` or `*.test.tsx` beside the subject.
- Use `__tests__` when one scenario spans several files in a feature.
- Shared test helpers go in `src/test-utils`.
- Do not export test-only helpers from production barrels.

## Testing Principles

- Test behavior, not implementation details.
- Use generated or realistic DTO shapes when testing API-backed code.
- Avoid snapshots for complex UI unless the output is intentionally stable.
- Mock network at the API helper or service boundary, not inside presentational
  components.
- Keep tests deterministic. Control timers, dates, and random values.
- Tests should fail for user-visible regressions and architecture violations.

## Coverage Expectations

- New shared infrastructure should have high branch coverage.
- New feature workflows should cover happy path, loading, empty, error, and
  denied states where applicable.
- Refactors must preserve or increase meaningful coverage for the touched
  module.
- If coverage cannot be added immediately, record the gap in `ROADMAP.md` with a
  reason and owner.

## E2E And Manual Verification

When a module affects navigation, auth, backend integration, or multi-step user
flows, add E2E coverage or document manual verification.

Manual verification should include:

- Route loads directly and through navigation.
- Loading and error states render.
- Forms submit and recover from validation errors.
- Capability-gated UI appears and disappears correctly.
- Production build can run locally through `pnpm preview` when runtime behavior
  changed.

## Test Data

- Prefer small factory helpers over large fixtures.
- Keep mock data close to the test unless shared by several tests.
- Do not use template mock data for backend-owned behavior once a real API
  contract exists.
- Use backend terminology and generated DTO names.

## Regression Rule

Every bug fix must include a test that fails before the fix when practical. If a
test is impossible or disproportionately expensive, record the reason in the
change summary or `ROADMAP.md`.
