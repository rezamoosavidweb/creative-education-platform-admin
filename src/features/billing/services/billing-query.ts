import type { ApiResponseBody, ApiResult } from '@/lib/api'
import type { BalanceDto, CouponDto } from '@/lib/api/generated/model'
import type { AuthCapability } from '@/lib/auth'
import type { PillTone } from '@/components/status-pill'

export type Order = ApiResponseBody<'/orders/mine', 'get'>[number]
export type Subscription = ApiResponseBody<'/subscriptions/mine', 'get'>[number]
export type Payout = ApiResponseBody<'/payouts/mine', 'get'>[number]
export type Coupon = CouponDto
export type Balance = BalanceDto

export const COMMERCE_COUPON_MANAGE_CAPABILITY =
  'commerce.coupon.manage' satisfies AuthCapability
export const COMMERCE_PAYOUT_MANAGE_CAPABILITY =
  'commerce.payout.manage' satisfies AuthCapability

export function getCommerceItems<T>(result: ApiResult<T[]> | undefined): T[] {
  return result?.data ?? []
}

export function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    currency,
    style: 'currency',
  }).format(amount / 100)
}

export function formatBillingDate(value: string | null | undefined): string {
  if (!value) return 'Not set'

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  }).format(new Date(value))
}

export function getOrderItemCount(order: Order): number {
  return Array.isArray(order.items) ? order.items.length : order.items ? 1 : 0
}

export function getOrderStatusTone(status: Order['status']): PillTone {
  switch (status) {
    case 'PAID':
    case 'FULFILLED':
      return 'ok'
    case 'CANCELLED':
    case 'REFUNDED':
      return 'neutral'
    case 'EXPIRED':
      return 'err'
    case 'PENDING':
    default:
      return 'warn'
  }
}

export function getSubscriptionStatusTone(
  status: Subscription['status']
): PillTone {
  switch (status) {
    case 'ACTIVE':
      return 'ok'
    case 'CANCELLED':
      return 'warn'
    case 'EXPIRED':
    default:
      return 'neutral'
  }
}

export function getPayoutStatusTone(status: Payout['status']): PillTone {
  switch (status) {
    case 'PAID':
      return 'ok'
    case 'REJECTED':
      return 'err'
    case 'REQUESTED':
    default:
      return 'warn'
  }
}

export function getCouponStatusTone(status: Coupon['status']): PillTone {
  return status === 'ACTIVE' ? 'ok' : 'neutral'
}

export function getCouponValue(coupon: Coupon): string {
  if (coupon.discountType === 'PERCENTAGE') return `${coupon.value}%`

  return coupon.currency
    ? formatMoney(coupon.value, coupon.currency)
    : coupon.value.toLocaleString()
}

export function getRedemptionSummary(coupon: Coupon): string {
  if (!coupon.maxRedemptions) {
    return `${coupon.redemptionCount.toLocaleString()} redeemed`
  }

  return `${coupon.redemptionCount.toLocaleString()} / ${coupon.maxRedemptions.toLocaleString()} redeemed`
}

export function canCancelOrder(order: Order): boolean {
  return order.status === 'PENDING'
}

export function canRetryOrderPayment(order: Order): boolean {
  return order.status === 'PENDING'
}

export function canRefundOrder(order: Order): boolean {
  return order.status === 'PAID' || order.status === 'FULFILLED'
}

export function canCancelSubscription(subscription: Subscription): boolean {
  return subscription.status === 'ACTIVE'
}
