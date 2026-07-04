# Phase 0.11 Reference Catalogs Audit

## Summary

The Reference Catalogs module was audited against the backend reference
contracts. The UI is correctly scoped to active, read-only taxonomy values and
uses the supported discipline filter only for catalogs that expose it.

## Backend Contracts

- `GET /reference/disciplines`
  - Lists active creative disciplines.
- `GET /reference/specializations`
  - Lists active specializations, optionally filtered by `disciplineId`.
- `GET /reference/genres`
  - Lists active genres, optionally filtered by `disciplineId`.
- `GET /reference/skills`
  - Lists active skills, optionally filtered by `disciplineId`.
- `GET /reference/proficiency-levels`
  - Lists active proficiency levels ordered by rank.

## Frontend Changes

- Clarified the page title and copy to present the module as read-only reference
  catalogs.
- Kept discipline filtering limited to specializations, genres, and skills.
- Kept the table unpaginated because all supported backend endpoints return
  arrays.

## Decision

Do not add create, update, archive, reorder, or activation controls for
reference catalogs until the backend exposes supported catalog-management
contracts.
