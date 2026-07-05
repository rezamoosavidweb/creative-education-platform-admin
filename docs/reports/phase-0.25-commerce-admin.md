# Phase 0.25 Commerce Administration

## Summary

The Billing page was expanded into the backend-supported commerce workspace:
current-user purchase/subscription actions, seller balance and payout requests,
admin payout decisions, and coupon management.

## Implemented Capabilities

- Current-user order list with cancel, retry-payment, and refund actions when
  backend order status allows them.
- Current-user subscription list with active subscription cancellation.
- Seller balance view on `GET /revenue/balance`.
- Seller payout request form on `POST /payouts`.
- Current-user payout list on `GET /payouts/mine`.
- Admin pending payout queue on `GET /payouts`, guarded by
  `commerce.payout.manage`, with approve/reject actions.
- Admin coupon list/create/disable on `GET/POST /coupons` and
  `POST /coupons/{id}/disable`, guarded by `commerce.coupon.manage`.

## Decisions

- Kept the commerce workflows in the existing Billing route because the route
  already owned current-user commerce history and payout requests.
- Used `useServerQuery` for list reads that expose cursor headers; generated
  Orval request functions are used for commerce commands.
- Kept checkout/offering purchase flows out of Admin because they are buyer
  product flows rather than administrative workspace actions.

## Backend Limitations

- No invoice, plan, usage, or global billing dashboard endpoints.
- No global order or subscription listing endpoints.
- No payout detail endpoint or historical admin payout list beyond pending
  payout requests.
- No coupon edit, enable/reactivate, delete, search, or filter endpoints.

## Verification Notes

- `npm.cmd run generate:api`
- `npm.cmd run validate:api`
- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd run knip`
- `npm.cmd run format:check`
- `npm.cmd run test` with
  `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`
- `npm.cmd run build`
- Billing runtime smoke on the production preview with mocked auth and commerce
  APIs completed without console errors or failed requests.
