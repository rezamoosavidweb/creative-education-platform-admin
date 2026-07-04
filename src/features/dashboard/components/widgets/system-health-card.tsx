import { memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type HealthMetric = {
  id: string
  label: string
  value: string
}

const HEALTH_METRICS: HealthMetric[] = [
  { id: 'latency', label: 'API Latency', value: '48ms' },
  { id: 'uptime', label: 'Uptime (30d)', value: '99.97%' },
  { id: 'error-rate', label: 'Error Rate', value: '0.04%' },
  { id: 'incidents', label: 'Active Incidents', value: '0' },
  { id: 'jobs', label: 'Queued Jobs', value: '12' },
]

export const SystemHealthCard = memo(function SystemHealthCard() {
  return (
    <Card className='border border-[var(--bdr)] bg-[var(--sur)]'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0'>
        <CardTitle className='text-[var(--t1)]'>System Health</CardTitle>
        <span className='flex items-center gap-1.5 text-[12.5px] font-medium text-[var(--ok)]'>
          <span className='h-[7px] w-[7px] animate-pulse rounded-full bg-[var(--ok)]' />
          All Operational
        </span>
      </CardHeader>
      <CardContent>
        <ul className='divide-y divide-[var(--bdr)]'>
          {HEALTH_METRICS.map((metric) => (
            <li
              key={metric.id}
              className='flex items-center justify-between py-2.5 text-[13px]'
            >
              <span className='text-[var(--t2)]'>{metric.label}</span>
              <span className='font-medium text-[var(--t1)] tabular-nums'>
                {metric.value}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
})
SystemHealthCard.displayName = 'SystemHealthCard'
