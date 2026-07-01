import { useMemo } from 'react'
import {
  apiDownload,
  apiRequest,
  apiUpload,
  createApiAbortController,
} from '@/lib/api'

export function useApi() {
  return useMemo(
    () => ({
      createAbortController: createApiAbortController,
      download: apiDownload,
      request: apiRequest,
      upload: apiUpload,
    }),
    []
  )
}
