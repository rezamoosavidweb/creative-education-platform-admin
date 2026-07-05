import { useState, type ReactNode } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, RotateCw, Save, X } from 'lucide-react'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api'
import { useCan } from '@/lib/capabilities'
import { useApiForm } from '@/lib/forms'
import { useServerQuery } from '@/lib/query'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { ApiEmpty, ApiError, ApiLoading, ApiQueryState } from '@/components/api'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { StatusPill } from '@/components/status-pill'
import {
  useApprovePayout,
  useCancelOrder,
  useCancelSubscription,
  useCreateCoupon,
  useDisableCoupon,
  useRefundOrder,
  useRejectPayout,
  useRequestPayout,
  useRetryOrderPayment,
} from './hooks/use-commerce-actions'
import {
  canCancelOrder,
  canCancelSubscription,
  canRefundOrder,
  canRetryOrderPayment,
  COMMERCE_COUPON_MANAGE_CAPABILITY,
  COMMERCE_PAYOUT_MANAGE_CAPABILITY,
  formatBillingDate,
  formatMoney,
  getCouponStatusTone,
  getCouponValue,
  getCommerceItems,
  getOrderItemCount,
  getOrderStatusTone,
  getPayoutStatusTone,
  getRedemptionSummary,
  getSubscriptionStatusTone,
  type Balance,
  type Coupon,
  type Order,
  type Payout,
  type Subscription,
} from './services/billing-query'

const payoutRequestSchema = z.object({
  amount: z.coerce.number().int().min(1),
  currency: z.string().trim().length(3),
})

const couponSchema = z
  .object({
    code: z.string().trim().min(3).max(40),
    currency: z.string().trim().length(3).optional().or(z.literal('')),
    discountType: z.enum(['PERCENTAGE', 'FIXED']),
    expiresAt: z.string().optional(),
    maxRedemptions: z.coerce.number().int().min(1).optional().or(z.literal('')),
    value: z.coerce.number().int().min(1),
  })
  .refine(
    (value) => value.discountType !== 'PERCENTAGE' || value.value <= 100,
    {
      message: 'Percentage coupons cannot exceed 100.',
      path: ['value'],
    }
  )
  .refine(
    (value) => value.discountType !== 'FIXED' || Boolean(value.currency),
    {
      message: 'Fixed coupons need a currency.',
      path: ['currency'],
    }
  )

const refundSchema = z.object({
  reason: z.string().trim().max(280).optional(),
})

export function Billing() {
  const [refundOrder, setRefundOrder] = useState<Order | null>(null)
  const canManageCoupons = useCan(COMMERCE_COUPON_MANAGE_CAPABILITY)
  const canManagePayouts = useCan(COMMERCE_PAYOUT_MANAGE_CAPABILITY)
  const ordersQuery = useServerQuery({
    queryKey: ['commerce', 'orders', 'mine'],
    request: {
      method: 'get',
      path: '/orders/mine',
      query: { limit: 10 },
    },
  })
  const subscriptionsQuery = useServerQuery({
    queryKey: ['commerce', 'subscriptions', 'mine'],
    request: {
      method: 'get',
      path: '/subscriptions/mine',
      query: { limit: 10 },
    },
  })
  const payoutsQuery = useServerQuery({
    queryKey: ['commerce', 'payouts', 'mine'],
    request: {
      method: 'get',
      path: '/payouts/mine',
      query: { limit: 10 },
    },
  })
  const balancesQuery = useServerQuery({
    queryKey: ['commerce', 'revenue', 'balance'],
    request: {
      method: 'get',
      path: '/revenue/balance',
    },
  })
  const pendingPayoutsQuery = useServerQuery({
    enabled: canManagePayouts,
    queryKey: ['commerce', 'payouts', 'pending'],
    request: {
      method: 'get',
      path: '/payouts',
      query: { limit: 20 },
    },
  })
  const couponsQuery = useServerQuery({
    enabled: canManageCoupons,
    queryKey: ['commerce', 'coupons'],
    request: {
      method: 'get',
      path: '/coupons',
      query: { limit: 20 },
    },
  })
  const orders = getCommerceItems(ordersQuery.data)
  const subscriptions = getCommerceItems(subscriptionsQuery.data)
  const payouts = getCommerceItems(payoutsQuery.data)
  const balances = getCommerceItems(balancesQuery.data)
  const pendingPayouts = getCommerceItems(pendingPayoutsQuery.data)
  const coupons = getCommerceItems(couponsQuery.data)

  return (
    <>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Billing</h2>
          <p className='text-muted-foreground'>
            Review commerce history, seller balances, payout workflows, and
            admin coupon controls.
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
            label='Seller balance currencies'
            value={balances.length}
            isLoading={balancesQuery.isLoading}
          />
          <CommerceSummaryCard
            label='Payout requests'
            value={payouts.length}
            isLoading={payoutsQuery.isLoading}
          />
        </div>

        <Tabs defaultValue='personal' className='grid gap-4'>
          <TabsList className='h-auto flex-wrap justify-start'>
            <TabsTrigger value='personal'>Personal commerce</TabsTrigger>
            <TabsTrigger value='seller'>Seller payouts</TabsTrigger>
            <TabsTrigger value='admin-payouts'>Payout queue</TabsTrigger>
            <TabsTrigger value='coupons'>Coupons</TabsTrigger>
          </TabsList>

          <TabsContent value='personal'>
            <div className='grid gap-4 xl:grid-cols-2'>
              <OrdersCard
                orders={orders}
                isError={ordersQuery.isError}
                isLoading={ordersQuery.isLoading}
                error={ordersQuery.error}
                onRetry={() => void ordersQuery.refetch()}
                onRefund={setRefundOrder}
              />
              <SubscriptionsCard
                subscriptions={subscriptions}
                isError={subscriptionsQuery.isError}
                isLoading={subscriptionsQuery.isLoading}
                error={subscriptionsQuery.error}
                onRetry={() => void subscriptionsQuery.refetch()}
              />
            </div>
          </TabsContent>

          <TabsContent value='seller'>
            <div className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]'>
              <PayoutsCard
                payouts={payouts}
                isError={payoutsQuery.isError}
                isLoading={payoutsQuery.isLoading}
                error={payoutsQuery.error}
                onRetry={() => void payoutsQuery.refetch()}
              />
              <SellerBalanceCard
                balances={balances}
                error={balancesQuery.error}
                isError={balancesQuery.isError}
                isLoading={balancesQuery.isLoading}
                onRetry={() => void balancesQuery.refetch()}
              />
            </div>
          </TabsContent>

          <TabsContent value='admin-payouts'>
            <AdminPayoutQueue
              enabled={canManagePayouts}
              payouts={pendingPayouts}
              error={pendingPayoutsQuery.error}
              isError={pendingPayoutsQuery.isError}
              isLoading={pendingPayoutsQuery.isLoading}
              onRetry={() => void pendingPayoutsQuery.refetch()}
            />
          </TabsContent>

          <TabsContent value='coupons'>
            <CouponsPanel
              enabled={canManageCoupons}
              coupons={coupons}
              error={couponsQuery.error}
              isError={couponsQuery.isError}
              isLoading={couponsQuery.isLoading}
              onRetry={() => void couponsQuery.refetch()}
            />
          </TabsContent>
        </Tabs>
      </Main>

      <RefundOrderDialog
        order={refundOrder}
        open={Boolean(refundOrder)}
        onOpenChange={(open) => {
          if (!open) setRefundOrder(null)
        }}
      />
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
  onRefund,
  onRetry,
  orders,
}: {
  error: unknown
  isError: boolean
  isLoading: boolean
  onRefund: (order: Order) => void
  onRetry: () => void
  orders: Order[]
}) {
  const cancelMutation = useCancelOrder()
  const retryMutation = useRetryOrderPayment()

  async function cancelOrder(order: Order) {
    const promise = cancelMutation.mutateAsync(order.id)
    toast.promise(promise, {
      loading: 'Cancelling order...',
      success: 'Order cancelled.',
      error: getApiErrorMessage,
    })
    await promise
  }

  async function retryPayment(order: Order) {
    const promise = retryMutation.mutateAsync(order.id)
    toast.promise(promise, {
      loading: 'Creating payment retry...',
      success: 'Payment retry created.',
      error: getApiErrorMessage,
    })
    await promise
  }

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
                <div className='mt-3 flex flex-wrap gap-2'>
                  <Button
                    type='button'
                    size='sm'
                    variant='outline'
                    disabled={
                      !canCancelOrder(order) || cancelMutation.isPending
                    }
                    onClick={() => void cancelOrder(order)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type='button'
                    size='sm'
                    variant='outline'
                    disabled={
                      !canRetryOrderPayment(order) || retryMutation.isPending
                    }
                    onClick={() => void retryPayment(order)}
                  >
                    <RotateCw className='size-3.5' />
                    Retry payment
                  </Button>
                  <Button
                    type='button'
                    size='sm'
                    variant='outline'
                    disabled={!canRefundOrder(order)}
                    onClick={() => onRefund(order)}
                  >
                    Refund
                  </Button>
                </div>
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
  const cancelMutation = useCancelSubscription()

  async function cancelSubscription(subscription: Subscription) {
    const promise = cancelMutation.mutateAsync(subscription.id)
    toast.promise(promise, {
      loading: 'Cancelling subscription...',
      success: 'Subscription cancelled.',
      error: getApiErrorMessage,
    })
    await promise
  }

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
                <Button
                  type='button'
                  size='sm'
                  variant='outline'
                  className='mt-3'
                  disabled={
                    !canCancelSubscription(subscription) ||
                    cancelMutation.isPending
                  }
                  onClick={() => void cancelSubscription(subscription)}
                >
                  Cancel subscription
                </Button>
              </div>
            ))}
          </div>
        </CommerceState>
      </CardContent>
    </Card>
  )
}

function SellerBalanceCard({
  balances,
  error,
  isError,
  isLoading,
  onRetry,
}: {
  balances: Balance[]
  error: unknown
  isError: boolean
  isLoading: boolean
  onRetry: () => void
}) {
  const requestMutation = useRequestPayout()
  const { form, handleApiSubmit } = useApiForm<
    z.input<typeof payoutRequestSchema>
  >({
    defaultValues: { amount: 0, currency: 'USD' },
    resolver: zodResolver(payoutRequestSchema),
  })
  const onSubmit = handleApiSubmit(async (values) => {
    const promise = requestMutation.mutateAsync({
      amount: Number(values.amount),
      currency: values.currency.toUpperCase(),
    })
    toast.promise(promise, {
      loading: 'Requesting payout...',
      success: 'Payout requested.',
      error: getApiErrorMessage,
    })
    await promise
    form.reset({ amount: 0, currency: values.currency.toUpperCase() })
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seller balance</CardTitle>
        <CardDescription>Available ledger balance by currency.</CardDescription>
      </CardHeader>
      <CardContent className='grid gap-4'>
        <CommerceState
          error={error}
          isError={isError}
          isLoading={isLoading}
          isEmpty={balances.length === 0}
          emptyTitle='No seller balance'
          onRetry={onRetry}
        >
          <div className='grid gap-2'>
            {balances.map((balance) => (
              <div
                key={balance.currency}
                className='flex items-center justify-between rounded-md border p-3'
              >
                <span>{balance.currency}</span>
                <span className='font-semibold'>
                  {formatMoney(balance.balance, balance.currency)}
                </span>
              </div>
            ))}
          </div>
        </CommerceState>

        <Form {...form}>
          <form onSubmit={onSubmit} className='grid gap-3'>
            <FormField
              control={form.control}
              name='amount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount in minor units</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      min={1}
                      value={field.value as number | string}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='currency'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Input maxLength={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={requestMutation.isPending}>
              {requestMutation.isPending ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                <Save className='size-4' />
              )}
              Request payout
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

function AdminPayoutQueue({
  enabled,
  error,
  isError,
  isLoading,
  onRetry,
  payouts,
}: {
  enabled: boolean
  error: unknown
  isError: boolean
  isLoading: boolean
  onRetry: () => void
  payouts: Payout[]
}) {
  const approveMutation = useApprovePayout()
  const rejectMutation = useRejectPayout()

  if (!enabled) {
    return (
      <ApiEmpty
        title='Payout queue unavailable'
        description='Your account is missing the commerce payout management capability.'
      />
    )
  }

  async function decidePayout(payout: Payout, approve: boolean) {
    const promise = approve
      ? approveMutation.mutateAsync(payout.id)
      : rejectMutation.mutateAsync(payout.id)
    toast.promise(promise, {
      loading: approve ? 'Approving payout...' : 'Rejecting payout...',
      success: approve ? 'Payout approved.' : 'Payout rejected.',
      error: getApiErrorMessage,
    })
    await promise
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending payouts</CardTitle>
        <CardDescription>
          Approve or reject seller payout requests.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ApiQueryState
          emptyTitle='No pending payouts'
          emptyDescription='The backend returned no payout requests awaiting review.'
          error={error}
          hasData={payouts.length > 0}
          isError={isError}
          isLoading={isLoading}
          loadingLabel='Loading pending payouts...'
          onRetry={onRetry}
        >
          <div className='overflow-hidden rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Seller</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell className='break-all'>
                      {payout.sellerUserId}
                    </TableCell>
                    <TableCell>
                      {formatMoney(payout.amount, payout.currency)}
                    </TableCell>
                    <TableCell>
                      <StatusPill tone={getPayoutStatusTone(payout.status)}>
                        {payout.status}
                      </StatusPill>
                    </TableCell>
                    <TableCell className='space-x-2 text-right'>
                      <Button
                        type='button'
                        size='sm'
                        onClick={() => void decidePayout(payout, true)}
                      >
                        Approve
                      </Button>
                      <Button
                        type='button'
                        size='sm'
                        variant='outline'
                        onClick={() => void decidePayout(payout, false)}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ApiQueryState>
      </CardContent>
    </Card>
  )
}

function CouponsPanel({
  coupons,
  enabled,
  error,
  isError,
  isLoading,
  onRetry,
}: {
  coupons: Coupon[]
  enabled: boolean
  error: unknown
  isError: boolean
  isLoading: boolean
  onRetry: () => void
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [disableCoupon, setDisableCoupon] = useState<Coupon | null>(null)
  const disableMutation = useDisableCoupon()

  if (!enabled) {
    return (
      <ApiEmpty
        title='Coupon management unavailable'
        description='Your account is missing the commerce coupon management capability.'
      />
    )
  }

  async function disableSelectedCoupon() {
    if (!disableCoupon) return
    const promise = disableMutation.mutateAsync(disableCoupon.id)
    toast.promise(promise, {
      loading: 'Disabling coupon...',
      success: 'Coupon disabled.',
      error: getApiErrorMessage,
    })
    await promise
    setDisableCoupon(null)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <div>
              <CardTitle>Coupons</CardTitle>
              <CardDescription>
                Create and disable backend checkout discount codes.
              </CardDescription>
            </div>
            <Button type='button' onClick={() => setDialogOpen(true)}>
              <Plus className='size-4' />
              New coupon
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ApiQueryState
            emptyTitle='No coupons'
            emptyDescription='Create the first checkout coupon.'
            error={error}
            hasData={coupons.length > 0}
            isError={isError}
            isLoading={isLoading}
            loadingLabel='Loading coupons...'
            onRetry={onRetry}
          >
            <div className='overflow-hidden rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Redemptions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell className='font-medium'>
                        {coupon.code}
                      </TableCell>
                      <TableCell>{getCouponValue(coupon)}</TableCell>
                      <TableCell>{getRedemptionSummary(coupon)}</TableCell>
                      <TableCell>
                        <StatusPill tone={getCouponStatusTone(coupon.status)}>
                          {coupon.status}
                        </StatusPill>
                      </TableCell>
                      <TableCell className='text-right'>
                        <Button
                          type='button'
                          size='sm'
                          variant='outline'
                          disabled={coupon.status !== 'ACTIVE'}
                          onClick={() => setDisableCoupon(coupon)}
                        >
                          Disable
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ApiQueryState>
        </CardContent>
      </Card>

      <CreateCouponDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <ConfirmDialog
        open={Boolean(disableCoupon)}
        onOpenChange={(open) => {
          if (!open) setDisableCoupon(null)
        }}
        title='Disable coupon?'
        desc='Disabled coupons can no longer be used at checkout.'
        confirmText={
          <>
            <X className='size-4' />
            Disable
          </>
        }
        isLoading={disableMutation.isPending}
        handleConfirm={() => void disableSelectedCoupon()}
      />
    </>
  )
}

function CreateCouponDialog({
  onOpenChange,
  open,
}: {
  onOpenChange: (open: boolean) => void
  open: boolean
}) {
  const createMutation = useCreateCoupon()
  const { form, handleApiSubmit } = useApiForm<z.input<typeof couponSchema>>({
    defaultValues: {
      code: '',
      currency: 'USD',
      discountType: 'PERCENTAGE',
      expiresAt: '',
      maxRedemptions: '',
      value: 1,
    },
    resolver: zodResolver(couponSchema),
  })
  const isPending = createMutation.isPending
  const discountType = form.watch('discountType')
  const onSubmit = handleApiSubmit(async (values) => {
    const promise = createMutation.mutateAsync({
      code: values.code.trim(),
      currency:
        values.discountType === 'FIXED'
          ? String(values.currency).toUpperCase()
          : undefined,
      discountType: values.discountType,
      expiresAt: values.expiresAt || undefined,
      maxRedemptions:
        typeof values.maxRedemptions === 'number'
          ? values.maxRedemptions
          : undefined,
      value: Number(values.value),
    })
    toast.promise(promise, {
      loading: 'Creating coupon...',
      success: 'Coupon created.',
      error: getApiErrorMessage,
    })
    await promise
    form.reset()
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create coupon</DialogTitle>
          <DialogDescription>
            Percentage values are 1-100. Fixed discounts require a currency.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='create-coupon-form'
            onSubmit={onSubmit}
            className='grid gap-4'
          >
            <FormField
              control={form.control}
              name='code'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='discountType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount type</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='PERCENTAGE'>PERCENTAGE</SelectItem>
                        <SelectItem value='FIXED'>FIXED</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='value'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={1}
                        disabled={isPending}
                        value={field.value as number | string}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {discountType === 'FIXED' && (
                <FormField
                  control={form.control}
                  name='currency'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <Input maxLength={3} disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name='maxRedemptions'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max redemptions</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={1}
                        disabled={isPending}
                        value={field.value as number | string}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='expiresAt'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expires at</FormLabel>
                    <FormControl>
                      <Input
                        type='datetime-local'
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='create-coupon-form' disabled={isPending}>
            {isPending ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <Save className='size-4' />
            )}
            Create coupon
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function RefundOrderDialog({
  onOpenChange,
  open,
  order,
}: {
  onOpenChange: (open: boolean) => void
  open: boolean
  order: Order | null
}) {
  const refundMutation = useRefundOrder()
  const { form, handleApiSubmit } = useApiForm<z.input<typeof refundSchema>>({
    defaultValues: { reason: '' },
    resolver: zodResolver(refundSchema),
  })
  const onSubmit = handleApiSubmit(async (values) => {
    if (!order) return
    const promise = refundMutation.mutateAsync({
      body: { reason: values.reason?.trim() || undefined },
      id: order.id,
    })
    toast.promise(promise, {
      loading: 'Refunding order...',
      success: 'Order refunded.',
      error: getApiErrorMessage,
    })
    await promise
    form.reset()
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Refund order</DialogTitle>
          <DialogDescription>
            Refunds follow backend seller/admin authorization and payment rules.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id='refund-order-form' onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name='reason'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            type='submit'
            form='refund-order-form'
            disabled={refundMutation.isPending}
          >
            Refund
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
