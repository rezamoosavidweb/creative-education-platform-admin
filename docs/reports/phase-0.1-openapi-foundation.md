# Phase 0.1 OpenAPI Foundation

Date: 2026-07-01

Scope: inspect backend OpenAPI generation, verify current generated admin
contract shape, and record the source-of-truth decision before API
infrastructure work. No business pages were implemented.

## Backend Generation Flow

Backend contract generation is driven by `../api/package.json`:

```bash
pnpm generate:contracts
```

That command runs:

1. `jest --config ./test/jest-contract.json --runInBand`
2. `openapi-typescript ./openapi.json -o ./src/generated/openapi-types.ts`

The emit test boots `AppModule` under ts-jest and writes `openapi.json` with the
same plugin-less `SwaggerModule.createDocument(...)` path guarded by backend
contract tests. Backend docs deliberately deferred runtime SDK tooling such as
`openapi-fetch` or `@hey-api/openapi-ts`.

## Current Admin Contract

Admin currently generates:

```bash
pnpm generate:api-types
```

Output:

```text
src/lib/api/schema.d.ts
```

Current backend `../api/openapi.json` inventory:

| Item | Count |
|---|---:|
| Paths | 162 |
| Operations | 194 |
| Component schemas | 179 |
| Named enum schemas | 46 |
| Operations with request bodies | 63 |
| Operations with response bodies | 167 |
| Missing operationIds | 0 |

## Verification Matrix

| Capability | Present? | Source |
|---|---:|---|
| API methods | No | Current `openapi-typescript` output is type-only. |
| Request types | Yes | `paths` / `operations` request bodies and parameters. |
| Response types | Yes | `paths` / `operations` response bodies and headers. |
| Enums | Yes | `components["schemas"]` named string unions. |
| Error models | Mostly no | 168 non-2xx responses have status/description only; only health `503` has a JSON body. |
| Response headers | Yes | Operation response `headers` maps, including generic header slots. |

## Decisions

- OpenAPI remains the only API source of truth for DTOs, enums, request bodies,
  response bodies, operation shapes, and any available error response bodies.
- Do not hand-write API DTOs, enums, request models, response models, or parallel
  API method signatures.
- Do not introduce a runtime SDK generator in this increment. The current
  generated contract has no callable methods, and adding a new generator is a
  dependency/tooling decision that should happen deliberately.
- Increment 0.2 may create API infrastructure helpers, but their compile-time
  inputs must be derived from `src/lib/api/schema.d.ts`.
- Because most error responses do not expose reusable OpenAPI error schemas,
  frontend error mapping should treat unknown error bodies defensively and prefer
  generated error body types only when they exist.

## Improvement Opportunities

These are documented, not implemented in 0.1:

- Add a runtime OpenAPI client generator later if the team wants concrete
  generated API methods. `openapi-fetch` is the lightest path already called out
  by backend docs; `@hey-api/openapi-ts` is broader but more opinionated.
- Improve backend error response schemas over time so common Nest error bodies
  become generated error models instead of status-only responses.
- Align admin generation with backend `generate:contracts` when backend contract
  changes are made, so `../api/openapi.json` and `src/lib/api/schema.d.ts` stay
  synchronized.
