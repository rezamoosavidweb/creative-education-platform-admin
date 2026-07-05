import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  couponControllerCreate,
  couponControllerDisable,
  orderControllerCancelOrder,
  orderControllerRefund,
  orderControllerRetryPayment,
  payoutControllerApprove,
  payoutControllerReject,
  payoutControllerRequest,
  subscriptionControllerCancel,
} from '@/lib/api/generated/endpoints/commerce/commerce'
import type {
  CreateCouponDto,
  RefundOrderDto,
  RequestPayoutDto,
} from '@/lib/api/generated/model'

const commerceMutationKeys = {
  coupons: ['commerce', 'coupons'] as const,
  orders: ['commerce', 'orders'] as const,
  payouts: ['commerce', 'payouts'] as const,
  subscriptions: ['commerce', 'subscriptions'] as const,
}

export function useRequestPayout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: RequestPayoutDto) => payoutControllerRequest(body),
    onSuccess: async () => {
      await queryClient.invalidateQueries()
    },
  })
}

export function useApprovePayout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => payoutControllerApprove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries()
    },
  })
}

export function useRejectPayout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => payoutControllerReject(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries()
    },
  })
}

export function useCreateCoupon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateCouponDto) => couponControllerCreate(body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: commerceMutationKeys.coupons,
      })
      await queryClient.invalidateQueries()
    },
  })
}

export function useDisableCoupon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => couponControllerDisable(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries()
    },
  })
}

export function useCancelOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => orderControllerCancelOrder(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: commerceMutationKeys.orders,
      })
      await queryClient.invalidateQueries()
    },
  })
}

export function useRetryOrderPayment() {
  return useMutation({
    mutationFn: (id: string) => orderControllerRetryPayment(id),
  })
}

export function useRefundOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ body, id }: { body: RefundOrderDto; id: string }) =>
      orderControllerRefund(id, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries()
    },
  })
}

export function useCancelSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => subscriptionControllerCancel(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries()
    },
  })
}
