# Phase 0.14 Billing Audit

## Summary

The Billing module was migrated from mock plan, usage, and invoice data to the
backend commerce contracts that currently exist for the caller: orders,
subscriptions, and payout requests.

## Backend Contracts

- `GET /orders/mine`
  - Lists the caller's purchase history with cursor pagination.
- `GET /subscriptions/mine`
  - Lists the caller's subscriptions with cursor pagination.
- `GET /payouts/mine`
  - Lists the caller's payout requests with cursor pagination.
- Admin coupon and pending-payout endpoints exist separately behind commerce
  capabilities and should become their own commerce admin surfaces.

## Frontend Changes

- Removed mock plan, usage, and invoice modules.
- Added backend-backed commerce sections for orders, subscriptions, and payout
  requests.
- Added loading, empty, and error states for each async section.
- Added helper coverage for commerce result extraction, currency formatting,
  generated order item shape, and generated order statuses.

## Decision

Keep Billing scoped to current-user commerce history until backend contracts add
invoice, plan, usage, or global billing administration endpoints.
