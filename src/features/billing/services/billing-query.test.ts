import { describe, expect, it } from 'vitest'
import {
  formatMoney,
  getCommerceItems,
  getOrderItemCount,
  getOrderStatusTone,
  type Order,
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
})
