# Phase 0.2 Orval Generation Foundation

Date: 2026-07-04

Scope: Add Orval runtime client generation without replacing the existing API,
auth, error, or React Query infrastructure.

## Completed

- Added Orval 8.20.0 as a dev dependency.
- Added `orval.config.ts`.
- Added `pnpm generate:api` for generated React Query clients.
- Added `pnpm validate:api` as generation with warnings treated as failures.
- Generated endpoint clients under `src/lib/api/generated/endpoints`.
- Generated DTO/model types under `src/lib/api/generated/model`.
- Added `src/lib/api/orval-mutator.ts` so generated calls use the shared
  `apiClient`.
- Added tests for the mutator integration.
- Excluded generated output from lint, formatting, coverage, and Knip authored
  source checks.

## OpenAPI Preprocessing

The backend `../api/openapi.json` remains the source of truth and was not
changed.

Orval validates the OpenAPI document more strictly than the current type-only
generation. The config performs frontend-only preprocessing before generation:

- Removes unsupported class-validator metadata keys such as `int`, `each`,
  `toLowerCase`, and `trimNewLines`.
- Adds missing OpenAPI path parameter definitions when a path template includes
  parameters such as `{id}` but the operation omits them.

These transformations make the existing backend contract consumable by Orval
without changing backend behavior or inventing endpoints.

## Generated Layout

```text
src/lib/api/generated/
  endpoints/
  model/
```

Generated files must never be edited by hand. Feature code should import
generated models and hooks as needed, while keeping app-owned auth, error
mapping, request configuration, and cache behavior in shared infrastructure.

## Verification

- `orval --config ./orval.config.ts --fail-on-warnings` passes.

Full lint/typecheck/test/build verification is required before the feature is
committed.
