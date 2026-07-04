import { ChartNoAxesColumn } from 'lucide-react'
import { ApiEmpty } from '@/components/api'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'

export function Analytics() {
  return (
    <>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Analytics</h2>
          <p className='text-muted-foreground'>
            Product analytics are not exposed by the backend API yet.
          </p>
        </div>

        <div className='rounded-md border bg-[var(--sur)] p-6'>
          <ChartNoAxesColumn className='mx-auto mb-3 size-8 text-muted-foreground' />
          <ApiEmpty
            title='No analytics API available'
            description='The backend exposes operational Prometheus metrics for scraping, but no supported Admin analytics contract.'
          />
        </div>
      </Main>
    </>
  )
}
