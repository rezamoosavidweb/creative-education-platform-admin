import { cn } from '@/lib/utils'

type ApiEmptyProps = {
  className?: string
  description?: string
  title?: string
}

export function ApiEmpty({
  className,
  description = 'No records match the current filters.',
  title = 'No results',
}: ApiEmptyProps) {
  return (
    <div
      className={cn(
        'flex min-h-24 flex-col items-center justify-center gap-1 text-center',
        className
      )}
    >
      <p className='text-sm font-medium text-[var(--t1)]'>{title}</p>
      <p className='text-sm text-muted-foreground'>{description}</p>
    </div>
  )
}
