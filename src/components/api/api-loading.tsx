import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type ApiLoadingProps = {
  className?: string
  label?: string
}

export function ApiLoading({
  className,
  label = 'Loading...',
}: ApiLoadingProps) {
  return (
    <div
      className={cn(
        'flex min-h-24 items-center justify-center gap-2 text-sm text-muted-foreground',
        className
      )}
    >
      <Loader2 className='size-4 animate-spin' />
      <span>{label}</span>
    </div>
  )
}
