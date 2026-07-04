# Phase 0.7 Organizations Audit

## Summary

The Organizations module was audited against the backend membership-scoped
contracts. The UI continues to use the supported organization, member, and team
operations, with copy and form controls tightened to match backend behavior.

## Backend Contracts

- `POST /organizations`
  - Creates an organization for the current authenticated user.
- `GET /organizations/mine`
  - Lists organizations where the current user has active membership.
- `GET /organizations/{id}`
  - Returns an organization for members only.
- `GET /organizations/{id}/members`
  - Lists organization members.
- `POST /organizations/{id}/members`
  - Adds a member through backend owner/admin policy.
- `PATCH /organizations/{id}/members/{userId}`
  - Assigns a member role through backend owner policy.
- `DELETE /organizations/{id}/members/{userId}`
  - Removes a member through backend owner/admin policy.
- `POST /organizations/{id}/teams`
  - Creates a team through backend owner/admin policy.
- `GET /organizations/{id}/teams`
  - Lists teams for members.

## Frontend Changes

- Updated page copy to reflect `/organizations/mine` membership scope.
- Replaced free-text organization type and role inputs with generated enum
  option lists.
- Removed no-op capability wrappers around org-role-governed actions; backend
  organization policies remain the source of truth.
- Added tests for generated org type and role option coverage.

## Decision

Do not present Organizations as a global admin directory unless the backend adds
global organization listing and global admin policy contracts.
