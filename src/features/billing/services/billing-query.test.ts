import { describe, expect, it } from 'vitest'
import {
  canCancelOrder,
  canCancelSubscription,
  canRefundOrder,
  canRetryOrderPayment,
  formatMoney,
  getCouponStatusTone,
  getCouponValue,
  getCommerceItems,
  getOrderItemCount,
  getOrderStatusTone,
  getRedemptionSummary,
  type Coupon,
  type Order,
  type Subscription,
} from './billing-query'

const order: Order = {
  buyerUserId: 'user-1',
  currency: 'USD',
  discountAmount: 0,
  id: 'order-1',
  items: {
    id: 'item-1',
    lineAmount: 1200,
    offeringId: 'offering-1',
    quantity: 1,
    resourceId: 'resource-1',
    resourceType: 'COURSE',
    sellerUserId: 'seller-1',
    title: 'Intro Course',
    unitAmount: 1200,
  },
  status: 'PAID',
  subtotalAmount: 1200,
  totalAmount: 1200,
}

const subscription: Subscription = {
  currentPeriodEnd: '2026-02-01T00:00:00.000Z',
  id: 'subscription-1',
  resourceId: 'course-1',
  resourceType: 'COURSE',
  status: 'ACTIVE',
  subscriberUserId: 'user-1',
  offeringId: 'offering-1',
}

const coupon: Coupon = {
  code: 'SAVE20',
  currency: null,
  discountType: 'PERCENTAGE',
  expiresAt: null,
  id: 'coupon-1',
  maxRedemptions: 10,
  redemptionCount: 2,
  status: 'ACTIVE',
  value: 20,
}

describe('billing query helpers', () => {
  it('reads commerce arrays from API results', () => {
    expect(
      getCommerceItems({
        data: [order],
        headers: {},
        nextCursor: null,
        status: 200,
      })
    ).toEqual([order])
    expect(getCommerceItems<Order>(undefined)).toEqual([])
  })

  it('formats minor currency units', () => {
    expect(formatMoney(12345, 'USD')).toBe('$123.45')
  })

  it('keeps the current generated order item shape visible', () => {
    expect(getOrderItemCount(order)).toBe(1)
  })

  it('maps order statuses to status tones', () => {
    expect(getOrderStatusTone('PAID')).toBe('ok')
    expect(getOrderStatusTone('EXPIRED')).toBe('err')
    expect(getOrderStatusTone('PENDING')).toBe('warn')
  })

  it('derives supported order and subscription actions from backend statuses', () => {
    expect(canCancelOrder({ ...order, status: 'PENDING' })).toBe(true)
    expect(canRetryOrderPayment({ ...order, status: 'PENDING' })).toBe(true)
    expect(canRefundOrder(order)).toBe(true)
    expect(canCancelSubscription(subscription)).toBe(true)
    expect(
      canCancelSubscription({ ...subscription, status: 'CANCELLED' })
    ).toBe(false)
  })

  it('formats coupon values and redemption state', () => {
    expect(getCouponValue(coupon)).toBe('20%')
    expect(
      getCouponValue({
        ...coupon,
        currency: 'USD',
        discountType: 'FIXED',
        value: 1234,
      })
    ).toBe('$12.34')
    expect(getRedemptionSummary(coupon)).toBe('2 / 10 redeemed')
    expect(getCouponStatusTone('ACTIVE')).toBe('ok')
    expect(getCouponStatusTone('DISABLED')).toBe('neutral')
  })
})
