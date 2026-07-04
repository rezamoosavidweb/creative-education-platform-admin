import { FileSearch } from 'lucide-react'
import { ApiEmpty } from '@/components/api'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'

type UnsupportedFeatureProps = {
  title: string
  eyebrow: string
  emptyTitle: string
  emptyDescription: string
}

export function UnsupportedFeature({
  title,
  eyebrow,
  emptyTitle,
  emptyDescription,
}: UnsupportedFeatureProps) {
  return (
    <>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
          <p className='text-muted-foreground'>{eyebrow}</p>
        </div>

        <div className='rounded-md border bg-[var(--sur)] p-6'>
          <FileSearch className='mx-auto mb-3 size-8 text-muted-foreground' />
          <ApiEmpty title={emptyTitle} description={emptyDescription} />
        </div>
      </Main>
    </>
  )
}
