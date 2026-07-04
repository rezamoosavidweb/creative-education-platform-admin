import { memo } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type Service, type ServiceStatus } from '../types/monitoring'

type ServiceStatusGridProps = {
  services: Service[]
  meta?: string
}

const STATUS_DOT: Record<ServiceStatus, string> = {
  Operational: 'bg-[var(--ok)]',
  Degraded: 'bg-[var(--warn)]',
  Outage: 'bg-[var(--err)]',
}

export const ServiceStatusGrid = memo(function ServiceStatusGrid({
  services,
  meta,
}: ServiceStatusGridProps) {
  return (
    <Card className='border border-[var(--bdr)] bg-[var(--sur)]'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0'>
        <CardTitle className='text-[var(--t1)]'>Service Status</CardTitle>
        {meta && <span className='text-xs text-[var(--t3)]'>{meta}</span>}
      </CardHeader>
      <CardContent>
        <div className='grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3'>
          {services.map((service) => (
            <div
              key={service.id}
              className='flex items-center justify-between gap-3 border-b border-[var(--bdr)] py-3 last:border-b-0'
            >
              <div className='flex items-center gap-3'>
                <span
                  className={cn(
                    'h-2 w-2 shrink-0 rounded-full',
                    STATUS_DOT[service.status]
                  )}
                  aria-label={service.status}
                />
                <div>
                  <div className='text-[13px] font-medium text-[var(--t1)]'>
                    {service.name}
                  </div>
                  <div className='text-[11px] text-[var(--t3)]'>
                    {service.uptime}
                  </div>
                </div>
              </div>
              <div className='text-[13px] text-[var(--t2)] tabular-nums'>
                {service.latency}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
})
ServiceStatusGrid.displayName = 'ServiceStatusGrid'
