import { memo } from 'react'
import { Inbox, LockKeyhole } from 'lucide-react'
import type { OutboxStatsDto } from '@/lib/api/generated/model'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type OutboxStatusCardProps = {
  canReadOutbox: boolean
  error?: string | null
  isLoading?: boolean
  stats: OutboxStatsDto | null
}

export const OutboxStatusCard = memo(function OutboxStatusCard({
  canReadOutbox,
  error,
  isLoading = false,
  stats,
}: OutboxStatusCardProps) {
  return (
    <Card className='border border-[var(--bdr)] bg-[var(--sur)]'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0'>
        <CardTitle className='text-[var(--t1)]'>Outbox Backlog</CardTitle>
        <Inbox className='h-4 w-4 text-[var(--t3)]' />
      </CardHeader>
      <CardContent>
        {!canReadOutbox ? (
          <div className='flex items-start gap-3 rounded-md border border-[var(--bdr)] bg-[var(--sur2)] p-3 text-sm text-[var(--t2)]'>
            <LockKeyhole className='mt-0.5 h-4 w-4 shrink-0' />
            Requires platform.outbox.manage to view admin outbox totals.
          </div>
        ) : error ? (
          <div className='rounded-md border border-[var(--err)]/40 bg-[var(--errs)] p-3 text-sm text-[var(--err)]'>
            {error}
          </div>
        ) : isLoading ? (
          <div className='grid grid-cols-3 gap-3'>
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className='h-20 animate-pulse rounded bg-[var(--sur2)]'
              />
            ))}
          </div>
        ) : !stats ? (
          <div className='rounded-md border border-[var(--bdr)] bg-[var(--sur2)] p-3 text-sm text-[var(--t2)]'>
            No outbox stats reported.
          </div>
        ) : (
          <dl className='grid grid-cols-3 gap-3'>
            <OutboxStat label='Pending' value={stats.pending} />
            <OutboxStat label='Failed' value={stats.failed} tone='danger' />
            <OutboxStat label='Processed' value={stats.processed} />
          </dl>
        )}
      </CardContent>
    </Card>
  )
})
OutboxStatusCard.displayName = 'OutboxStatusCard'

function OutboxStat({
  label,
  value,
  tone = 'neutral',
}: {
  label: string
  tone?: 'danger' | 'neutral'
  value: number
}) {
  return (
    <div className='rounded-md border border-[var(--bdr)] bg-[var(--sur2)] p-3'>
      <dt className='text-xs text-[var(--t3)]'>{label}</dt>
      <dd
        className={
          tone === 'danger'
            ? 'mt-1 text-xl font-semibold text-[var(--err)] tabular-nums'
            : 'mt-1 text-xl font-semibold text-[var(--t1)] tabular-nums'
        }
      >
        {value.toLocaleString()}
      </dd>
    </div>
  )
}
