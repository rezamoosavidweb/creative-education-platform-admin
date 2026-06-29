import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TeamCard } from './components/team-card'
import { teams } from './data/teams'

export function Teams() {
  return (
    <>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Teams</h2>
            <p className='text-muted-foreground'>
              Organize workspace members into functional teams.
            </p>
          </div>
          <Button>
            <Plus className='h-4 w-4' />
            Create Team
          </Button>
        </div>

        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      </Main>
    </>
  )
}
