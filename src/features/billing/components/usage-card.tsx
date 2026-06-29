import { memo } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { usage } from '../data/billing'

export const UsageCard = memo(function UsageCard() {
  return (
    <Card className='border border-[var(--bdr)] bg-[var(--sur)]'>
      <CardHeader>
        <CardTitle className='text-[var(--t1)]'>Usage This Month</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {usage.map((metric) => {
          const percent = Math.min(
            100,
            Math.round((metric.current / metric.limit) * 100)
          )
          return (
            <div key={metric.id}>
              <div className='mb-1.5 flex items-center justify-between text-[13px]'>
                <span className='text-[var(--t2)]'>{metric.label}</span>
                <span className='tabular-nums text-[var(--t1)]'>
                  {metric.display}
                </span>
              </div>
              <div className='h-1.5 overflow-hidden rounded-full bg-[var(--sur3)]'>
                <div
                  className='h-full rounded-full bg-[var(--pri)] transition-[width]'
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
})
UsageCard.displayName = 'UsageCard'
