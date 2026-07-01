import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type CursorPaginationProps = {
  className?: string
  hasNextPage: boolean
  hasPreviousPage?: boolean
  isRefreshing?: boolean
  nextCursor: string | null
  onNext: (cursor: string) => void
  onPrevious?: () => void
  onRefresh?: () => void
}

export function CursorPagination({
  className,
  hasNextPage,
  hasPreviousPage = false,
  isRefreshing = false,
  nextCursor,
  onNext,
  onPrevious,
  onRefresh,
}: CursorPaginationProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 px-2',
        '@max-2xl/content:flex-col @max-2xl/content:items-stretch',
        className
      )}
    >
      <p className='text-sm text-muted-foreground'>Cursor pagination</p>
      <div className='flex items-center gap-2'>
        {onRefresh && (
          <Button
            variant='outline'
            size='sm'
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={cn('size-3.5', isRefreshing && 'animate-spin')}
            />
            Refresh
          </Button>
        )}
        {onPrevious && (
          <Button
            variant='outline'
            size='sm'
            onClick={onPrevious}
            disabled={!hasPreviousPage}
          >
            <ChevronLeft className='size-3.5' />
            Previous
          </Button>
        )}
        <Button
          variant='outline'
          size='sm'
          onClick={() => nextCursor && onNext(nextCursor)}
          disabled={!hasNextPage || !nextCursor}
        >
          Next
          <ChevronRight className='size-3.5' />
        </Button>
      </div>
    </div>
  )
}
