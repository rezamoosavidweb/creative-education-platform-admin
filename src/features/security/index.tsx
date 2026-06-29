import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { LoginHistoryTable } from './components/login-history-table'
import { PasswordCard } from './components/password-card'
import { TwoFactorCard } from './components/two-factor-card'

export function Security() {
  return (
    <>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Security</h2>
          <p className='text-muted-foreground'>
            Passwords, two-factor authentication, and login history.
          </p>
        </div>

        <div className='grid gap-4 sm:gap-6 lg:grid-cols-2'>
          <PasswordCard />
          <TwoFactorCard />
        </div>

        <LoginHistoryTable />
      </Main>
    </>
  )
}
