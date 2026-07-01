import { RefreshCw } from 'lucide-react'
import { getApiErrorMessage } from '@/lib/api'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type ApiErrorProps = {
  className?: string
  error: unknown
  onRetry?: () => void
  retryLabel?: string
  title?: string
}

export function ApiError({
  className,
  error,
  onRetry,
  retryLabel = 'Try again',
  title = 'Unable to load data',
}: ApiErrorProps) {
  return (
    <div
      className={cn(
        'flex min-h-24 flex-col items-center justify-center gap-3 text-center',
        className
      )}
    >
      <div className='space-y-1'>
        <p className='text-sm font-medium text-[var(--t1)]'>{title}</p>
        <p className='text-sm text-muted-foreground'>
          {getApiErrorMessage(error)}
        </p>
      </div>
      {onRetry && (
        <Button variant='outline' size='sm' onClick={onRetry}>
          <RefreshCw className='size-3.5' />
          {retryLabel}
        </Button>
      )}
    </div>
  )
}
