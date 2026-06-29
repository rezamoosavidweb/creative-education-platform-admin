import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { DashboardLayout } from './components/dashboard-layout'

export function Dashboard() {
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header fixed />

      {/* ===== Main ===== */}
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <DashboardLayout />
      </Main>
    </>
  )
}
