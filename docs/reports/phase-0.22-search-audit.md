# Phase 0.22 Search Audit

## Scope

Implemented the backend-backed Search module from the search bounded context.

## Backend Contracts

Used generated Search endpoint functions for:

- `GET /search` faceted, ranked, cursor-paginated search.
- `GET /search/autocomplete` entity autocomplete suggestions.
- `GET /search/suggestions` popular term suggestions.

The backend supports optional text, entity type, location, boolean profile
filters, taxonomy IDs, sort, limit, and cursor parameters. The generated
OpenAPI model currently represents some response arrays as singular DTOs, so
the frontend normalizes those response fields at the feature boundary without
editing generated code.

## Changes

- Added `/search` route and Discovery navigation entry.
- Added search filters for text, entity type, sort, country, city, verified,
  available-for-hire, and discipline IDs.
- Added autocomplete and term suggestion panels.
- Added faceted result summary, result table, relevance score, tags, location,
  rating, and cursor pagination.
- Added loading, error, empty, and responsive states.
- Added unit coverage for generated enum options, CSV parsing, result labels,
  facet normalization, hit normalization, tag extraction, and rating/location
  formatting.

## Follow-Up

If the backend OpenAPI schema starts emitting proper array metadata for nested
search results and facet buckets, remove the local normalization workaround.
