import { memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export type StatTone = 'ok' | 'warn' | 'err' | 'muted'

export type StatCardProps = {
  label: string
  value: string
  valueTone?: 'default' | 'ok'
  foot?: string
  footTone?: StatTone
  footDirection?: 'up' | 'down'
  className?: string
}

const TONE_TEXT: Record<StatTone, string> = {
  ok: 'text-[var(--ok)]',
  warn: 'text-[var(--warn)]',
  err: 'text-[var(--err)]',
  muted: 'text-[var(--t3)]',
}

/**
 * Compact KPI card: label, large value, and an optional colored footnote with
 * an optional trend arrow. Shared by Monitoring, Analytics, and similar pages.
 */
export const StatCard = memo(function StatCard({
  label,
  value,
  valueTone = 'default',
  foot,
  footTone = 'muted',
  footDirection,
  className,
}: StatCardProps) {
  const arrow =
    footDirection === 'up' ? '↑ ' : footDirection === 'down' ? '↓ ' : ''

  return (
    <Card className={cn('border border-[var(--bdr)] bg-[var(--sur)]', className)}>
      <CardContent className='space-y-3 px-5 py-5'>
        <p className='text-xs font-medium text-[var(--t2)]'>{label}</p>
        <div
          className={cn(
            'text-[28px] leading-none font-bold tabular-nums',
            valueTone === 'ok' ? 'text-[var(--ok)]' : 'text-[var(--t1)]'
          )}
        >
          {value}
        </div>
        {foot && (
          <p className={cn('text-xs font-medium', TONE_TEXT[footTone])}>
            {arrow}
            {foot}
          </p>
        )}
      </CardContent>
    </Card>
  )
})
StatCard.displayName = 'StatCard'
