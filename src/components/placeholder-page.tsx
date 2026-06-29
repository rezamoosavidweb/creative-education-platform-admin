import { Construction } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'

type PlaceholderPageProps = {
  title: string
  description: string
}

/**
 * Standard page shell for nav destinations that exist in the design but whose
 * full implementation is pending. Keeps the sidebar complete without dead links.
 */
export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
          <p className='text-muted-foreground'>{description}</p>
        </div>

        <div className='flex flex-1 flex-col items-center justify-center gap-3 rounded-[10px] border border-dashed border-[var(--bdr2)] bg-[var(--sur)] py-24 text-center'>
          <Construction className='h-12 w-12 text-[var(--t3)]' />
          <p className='text-lg font-semibold text-[var(--t1)]'>Coming soon</p>
          <p className='max-w-sm text-sm text-[var(--t2)]'>
            This section is part of the design and will be implemented next.
          </p>
        </div>
      </Main>
    </>
  )
}
