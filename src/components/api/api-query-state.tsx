import type { ReactNode } from 'react'
import { ApiEmpty } from './api-empty'
import { ApiError } from './api-error'
import { ApiLoading } from './api-loading'

type ApiQueryStateProps = {
  children: ReactNode
  emptyDescription?: string
  emptyTitle: string
  error: unknown
  hasData: boolean
  isError: boolean
  isLoading: boolean
  loadingLabel: string
  onRetry: () => void
}

export function ApiQueryState({
  children,
  emptyDescription,
  emptyTitle,
  error,
  hasData,
  isError,
  isLoading,
  loadingLabel,
  onRetry,
}: ApiQueryStateProps) {
  if (isLoading) return <ApiLoading label={loadingLabel} />
  if (isError) return <ApiError error={error} onRetry={onRetry} />
  if (!hasData) {
    return <ApiEmpty title={emptyTitle} description={emptyDescription} />
  }

  return children
}
