# Phase 0.3 Capability Navigation

## Summary

The command palette now applies the same capability-aware navigation filtering
as the sidebar. Protected routes are hidden from users who do not have the
required capability and remain available when access is granted.

## Scope

- Reused the existing `filterNavGroupsByCapabilities` helper in
  `CommandMenu`.
- Added browser tests for hidden protected commands and allowed protected
  navigation.
- Updated `ROADMAP.md` to record completion and remaining navigation debt.

## Verification Notes

The feature should be verified with the standard Admin gates:

- API generation validation.
- TypeScript.
- ESLint.
- Knip.
- Prettier.
- Browser test suite.
- Production build.

## Decision

Navigation visibility must continue to come from shared capability helpers so
sidebar, command palette, and future navigation surfaces remain consistent.
