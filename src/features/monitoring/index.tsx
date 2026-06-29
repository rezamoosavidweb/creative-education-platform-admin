import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { StatCard } from '@/components/stat-card'
import { LatencyChart } from './components/latency-chart'
import { ServiceStatusGrid } from './components/service-status-grid'
import { latencySeries, monitoringStats, services } from './data/monitoring'

export function Monitoring() {
  return (
    <>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Monitoring</h2>
            <p className='text-muted-foreground'>
              Real-time system health and performance metrics.
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-2 text-[13px] font-medium text-[var(--ok)]'>
              <span className='h-[7px] w-[7px] animate-pulse rounded-full bg-[var(--ok)]' />
              All Systems Operational
            </div>
            <Button variant='outline'>
              <RefreshCw className='h-4 w-4' />
              Refresh
            </Button>
          </div>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {monitoringStats.map((stat) => (
            <StatCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              valueTone={stat.valueTone}
              foot={stat.foot}
              footTone={stat.footTone}
              footDirection={stat.footDirection}
            />
          ))}
        </div>

        <LatencyChart data={latencySeries} />

        <ServiceStatusGrid
          services={services}
          meta={`${services.length} services · last checked 30s ago`}
        />
      </Main>
    </>
  )
}
