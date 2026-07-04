import type { ReactNode } from 'react'
import { useServerQuery } from '@/lib/query'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ApiEmpty, ApiError, ApiLoading } from '@/components/api'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { StatusPill } from '@/components/status-pill'
import {
  formatBillingDate,
  formatMoney,
  getCommerceItems,
  getOrderItemCount,
  getOrderStatusTone,
  getPayoutStatusTone,
  getSubscriptionStatusTone,
  type Order,
  type Payout,
  type Subscription,
} from './services/billing-query'

export function Billing() {
  const ordersQuery = useServerQuery({
    request: {
      method: 'get',
      path: '/orders/mine',
      query: { limit: 10 },
    },
  })
  const subscriptionsQuery = useServerQuery({
    request: {
      method: 'get',
      path: '/subscriptions/mine',
      query: { limit: 10 },
    },
  })
  const payoutsQuery = useServerQuery({
    request: {
      method: 'get',
      path: '/payouts/mine',
      query: { limit: 10 },
    },
  })
  const orders = getCommerceItems(ordersQuery.data)
  const subscriptions = getCommerceItems(subscriptionsQuery.data)
  const payouts = getCommerceItems(payoutsQuery.data)

  return (
    <>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Billing</h2>
          <p className='text-muted-foreground'>
            Review your backend commerce history and payout requests.
          </p>
        </div>

        <div className='grid gap-4 sm:grid-cols-3'>
          <CommerceSummaryCard
            label='Orders'
            value={orders.length}
            isLoading={ordersQuery.isLoading}
          />
          <CommerceSummaryCard
            label='Subscriptions'
            value={subscriptions.length}
            isLoading={subscriptionsQuery.isLoading}
          />
          <CommerceSummaryCard
            label='Payouts'
            value={payouts.length}
            isLoading={payoutsQuery.isLoading}
          />
        </div>

        <div className='grid gap-4 xl:grid-cols-3'>
          <OrdersCard
            orders={orders}
            isError={ordersQuery.isError}
            isLoading={ordersQuery.isLoading}
            error={ordersQuery.error}
            onRetry={() => void ordersQuery.refetch()}
          />
          <SubscriptionsCard
            subscriptions={subscriptions}
            isError={subscriptionsQuery.isError}
            isLoading={subscriptionsQuery.isLoading}
            error={subscriptionsQuery.error}
            onRetry={() => void subscriptionsQuery.refetch()}
          />
          <PayoutsCard
            payouts={payouts}
            isError={payoutsQuery.isError}
            isLoading={payoutsQuery.isLoading}
            error={payoutsQuery.error}
            onRetry={() => void payoutsQuery.refetch()}
          />
        </div>
      </Main>
    </>
  )
}

function CommerceSummaryCard({
  isLoading,
  label,
  value,
}: {
  isLoading: boolean
  label: string
  value: number
}) {
  return (
    <Card>
      <CardHeader className='pb-2'>
        <CardDescription>{label}</CardDescription>
        <CardTitle className='text-2xl'>
          {isLoading ? '...' : value.toLocaleString()}
        </CardTitle>
      </CardHeader>
    </Card>
  )
}

function OrdersCard({
  error,
  isError,
  isLoading,
  onRetry,
  orders,
}: {
  error: unknown
  isError: boolean
  isLoading: boolean
  onRetry: () => void
  orders: Order[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase history</CardTitle>
        <CardDescription>Latest purchase records.</CardDescription>
      </CardHeader>
      <CardContent>
        <CommerceState
          error={error}
          isError={isError}
          isLoading={isLoading}
          isEmpty={orders.length === 0}
          emptyTitle='No orders'
          onRetry={onRetry}
        >
          <div className='grid gap-3'>
            {orders.map((order) => (
              <div key={order.id} className='rounded-md border p-3'>
                <div className='flex items-start justify-between gap-3'>
                  <div className='min-w-0'>
                    <p className='truncate text-sm font-medium'>{order.id}</p>
                    <p className='text-xs text-muted-foreground'>
                      {getOrderItemCount(order)} item
                      {getOrderItemCount(order) === 1 ? '' : 's'} - paid{' '}
                      {formatBillingDate(order.paidAt)}
                    </p>
                  </div>
                  <StatusPill tone={getOrderStatusTone(order.status)}>
                    {order.status}
                  </StatusPill>
                </div>
                <p className='mt-2 text-sm font-semibold'>
                  {formatMoney(order.totalAmount, order.currency)}
                </p>
              </div>
            ))}
          </div>
        </CommerceState>
      </CardContent>
    </Card>
  )
}

function SubscriptionsCard({
  error,
  isError,
  isLoading,
  onRetry,
  subscriptions,
}: {
  error: unknown
  isError: boolean
  isLoading: boolean
  onRetry: () => void
  subscriptions: Subscription[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscriptions</CardTitle>
        <CardDescription>Current-user subscriptions.</CardDescription>
      </CardHeader>
      <CardContent>
        <CommerceState
          error={error}
          isError={isError}
          isLoading={isLoading}
          isEmpty={subscriptions.length === 0}
          emptyTitle='No subscriptions'
          onRetry={onRetry}
        >
          <div className='grid gap-3'>
            {subscriptions.map((subscription) => (
              <div key={subscription.id} className='rounded-md border p-3'>
                <div className='flex items-start justify-between gap-3'>
                  <div className='min-w-0'>
                    <p className='truncate text-sm font-medium'>
                      {subscription.resourceType}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      Ends {formatBillingDate(subscription.currentPeriodEnd)}
                    </p>
                  </div>
                  <StatusPill
                    tone={getSubscriptionStatusTone(subscription.status)}
                  >
                    {subscription.status}
                  </StatusPill>
                </div>
              </div>
            ))}
          </div>
        </CommerceState>
      </CardContent>
    </Card>
  )
}

function PayoutsCard({
  error,
  isError,
  isLoading,
  onRetry,
  payouts,
}: {
  error: unknown
  isError: boolean
  isLoading: boolean
  onRetry: () => void
  payouts: Payout[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payout requests</CardTitle>
        <CardDescription>
          Seller payout requests for the caller.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CommerceState
          error={error}
          isError={isError}
          isLoading={isLoading}
          isEmpty={payouts.length === 0}
          emptyTitle='No payout requests'
          onRetry={onRetry}
        >
          <div className='grid gap-3'>
            {payouts.map((payout) => (
              <div key={payout.id} className='rounded-md border p-3'>
                <div className='flex items-start justify-between gap-3'>
                  <div>
                    <p className='text-sm font-semibold'>
                      {formatMoney(payout.amount, payout.currency)}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      Decided {formatBillingDate(payout.decidedAt)}
                    </p>
                  </div>
                  <StatusPill tone={getPayoutStatusTone(payout.status)}>
                    {payout.status}
                  </StatusPill>
                </div>
              </div>
            ))}
          </div>
        </CommerceState>
      </CardContent>
    </Card>
  )
}

function CommerceState({
  children,
  emptyTitle,
  error,
  isEmpty,
  isError,
  isLoading,
  onRetry,
}: {
  children: ReactNode
  emptyTitle: string
  error: unknown
  isEmpty: boolean
  isError: boolean
  isLoading: boolean
  onRetry: () => void
}) {
  if (isLoading) return <ApiLoading label='Loading commerce records...' />
  if (isError) return <ApiError error={error} onRetry={onRetry} />
  if (isEmpty) return <ApiEmpty title={emptyTitle} />

  return <>{children}</>
}
