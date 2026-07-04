# Phase 0.13 Analytics Audit

## Summary

The Analytics module was audited against the backend. No supported Admin product
analytics endpoint exists for traffic, top pages, event timelines, growth
trends, or exports. The previous page was mock-backed and has been removed from
navigation.

## Backend Findings

- `GET /metrics` exists as an operational Prometheus scrape endpoint.
- The metrics scrape endpoint is excluded from OpenAPI with
  `ApiExcludeEndpoint`.
- The backend does not expose an Admin analytics API with DTOs, permissions,
  filters, time ranges, or chart-ready responses.

## Frontend Changes

- Removed mock analytics chart, table, toggle, and data modules.
- Removed Analytics from sidebar navigation so it is not advertised as a
  supported feature.
- Kept the route as an unavailable-state page for direct links.

## Blocker

Product analytics cannot be implemented without backend analytics contracts.
Prometheus scrape output is not a replacement for a typed Admin analytics API.
