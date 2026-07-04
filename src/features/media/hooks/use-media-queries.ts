import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  mediaControllerDeleteAsset,
  mediaControllerGetAsset,
  mediaControllerUpload,
} from '@/lib/api/generated/endpoints/media/media'
import type { MediaUploadBody, MediaUploadParams } from '../types'

export const mediaQueryKeys = {
  all: ['media'] as const,
  asset: (id: string | null) => ['media', 'asset', id] as const,
}

export function useMediaAsset(id: string | null) {
  return useQuery({
    enabled: Boolean(id),
    queryFn: ({ signal }) =>
      mediaControllerGetAsset(id ?? '', undefined, signal),
    queryKey: mediaQueryKeys.asset(id),
  })
}

function useMediaInvalidation() {
  const queryClient = useQueryClient()

  return async () => {
    await queryClient.invalidateQueries({ queryKey: mediaQueryKeys.all })
  }
}

export function useUploadMedia() {
  const invalidate = useMediaInvalidation()

  return useMutation({
    mutationFn: ({
      body,
      params,
    }: {
      body: MediaUploadBody
      params: MediaUploadParams
    }) => mediaControllerUpload(body, params),
    onSuccess: invalidate,
  })
}

export function useDeleteMediaAsset() {
  const invalidate = useMediaInvalidation()

  return useMutation({
    mutationFn: (id: string) => mediaControllerDeleteAsset(id),
    onSuccess: invalidate,
  })
}
