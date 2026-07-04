import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  contractControllerCancel,
  contractControllerComplete,
  contractControllerMine,
  jobControllerAccept,
  jobControllerApplications,
  jobControllerApply,
  jobControllerClose,
  jobControllerMyApplications,
  jobControllerPost,
  jobControllerReject,
  jobControllerSearch,
  jobControllerWithdraw,
  serviceListingControllerCreate,
  serviceListingControllerMine,
  serviceListingControllerPublish,
  serviceListingControllerSearch,
  serviceListingControllerUnlist,
} from '@/lib/api/generated/endpoints/marketplace/marketplace'
import type {
  ListServiceRequest,
  PostJobRequest,
  SubmitApplicationRequest,
} from '../types'

export const marketplaceQueryKeys = {
  all: ['marketplace'] as const,
  applications: (jobId: string) =>
    ['marketplace', 'jobs', jobId, 'applications'] as const,
  contracts: () => ['marketplace', 'contracts', 'mine'] as const,
  jobs: () => ['marketplace', 'jobs'] as const,
  myApplications: () => ['marketplace', 'applications', 'mine'] as const,
  myServices: () => ['marketplace', 'services', 'mine'] as const,
  services: () => ['marketplace', 'services'] as const,
}

export function useMarketplaceServices() {
  return useQuery({
    queryFn: ({ signal }) => serviceListingControllerSearch(undefined, signal),
    queryKey: marketplaceQueryKeys.services(),
  })
}

export function useMyMarketplaceServices() {
  return useQuery({
    queryFn: ({ signal }) => serviceListingControllerMine(undefined, signal),
    queryKey: marketplaceQueryKeys.myServices(),
  })
}

export function useMarketplaceJobs() {
  return useQuery({
    queryFn: ({ signal }) => jobControllerSearch(undefined, signal),
    queryKey: marketplaceQueryKeys.jobs(),
  })
}

export function useMyMarketplaceApplications() {
  return useQuery({
    queryFn: ({ signal }) => jobControllerMyApplications(undefined, signal),
    queryKey: marketplaceQueryKeys.myApplications(),
  })
}

export function useMarketplaceContracts() {
  return useQuery({
    queryFn: ({ signal }) => contractControllerMine(undefined, signal),
    queryKey: marketplaceQueryKeys.contracts(),
  })
}

export function useJobApplications(jobId: string | null, enabled: boolean) {
  return useQuery({
    enabled: enabled && Boolean(jobId),
    queryFn: ({ signal }) =>
      jobControllerApplications(jobId ?? '', undefined, signal),
    queryKey: marketplaceQueryKeys.applications(jobId ?? 'none'),
  })
}

function useMarketplaceInvalidation() {
  const queryClient = useQueryClient()

  return async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: marketplaceQueryKeys.all }),
    ])
  }
}

export function useCreateMarketplaceService() {
  const invalidate = useMarketplaceInvalidation()

  return useMutation({
    mutationFn: (variables: ListServiceRequest) =>
      serviceListingControllerCreate(variables),
    onSuccess: invalidate,
  })
}

export function usePublishMarketplaceService() {
  const invalidate = useMarketplaceInvalidation()

  return useMutation({
    mutationFn: (id: string) => serviceListingControllerPublish(id),
    onSuccess: invalidate,
  })
}

export function useUnlistMarketplaceService() {
  const invalidate = useMarketplaceInvalidation()

  return useMutation({
    mutationFn: (id: string) => serviceListingControllerUnlist(id),
    onSuccess: invalidate,
  })
}

export function usePostMarketplaceJob() {
  const invalidate = useMarketplaceInvalidation()

  return useMutation({
    mutationFn: (variables: PostJobRequest) => jobControllerPost(variables),
    onSuccess: invalidate,
  })
}

export function useCloseMarketplaceJob() {
  const invalidate = useMarketplaceInvalidation()

  return useMutation({
    mutationFn: (id: string) => jobControllerClose(id),
    onSuccess: invalidate,
  })
}

export function useApplyToMarketplaceJob() {
  const invalidate = useMarketplaceInvalidation()

  return useMutation({
    mutationFn: ({
      jobId,
      body,
    }: {
      body: SubmitApplicationRequest
      jobId: string
    }) => jobControllerApply(jobId, body),
    onSuccess: invalidate,
  })
}

export function useAcceptMarketplaceApplication() {
  const invalidate = useMarketplaceInvalidation()

  return useMutation({
    mutationFn: (id: string) => jobControllerAccept(id),
    onSuccess: invalidate,
  })
}

export function useRejectMarketplaceApplication() {
  const invalidate = useMarketplaceInvalidation()

  return useMutation({
    mutationFn: (id: string) => jobControllerReject(id),
    onSuccess: invalidate,
  })
}

export function useWithdrawMarketplaceApplication() {
  const invalidate = useMarketplaceInvalidation()

  return useMutation({
    mutationFn: (id: string) => jobControllerWithdraw(id),
    onSuccess: invalidate,
  })
}

export function useCompleteMarketplaceContract() {
  const invalidate = useMarketplaceInvalidation()

  return useMutation({
    mutationFn: (id: string) => contractControllerComplete(id),
    onSuccess: invalidate,
  })
}

export function useCancelMarketplaceContract() {
  const invalidate = useMarketplaceInvalidation()

  return useMutation({
    mutationFn: (id: string) => contractControllerCancel(id),
    onSuccess: invalidate,
  })
}
