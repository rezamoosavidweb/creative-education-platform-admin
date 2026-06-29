import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProjectCard } from './components/project-card'
import { ProjectFilterTabs } from './components/project-filter-tabs'
import { projects } from './data/projects'
import { type ProjectFilter } from './types/project'

export function Projects() {
  const [filter, setFilter] = useState<ProjectFilter>('All')

  const counts = useMemo<Record<ProjectFilter, number>>(
    () => ({
      All: projects.length,
      Active: projects.filter((p) => p.status === 'Active').length,
      Completed: projects.filter((p) => p.status === 'Completed').length,
      Archived: projects.filter((p) => p.status === 'Archived').length,
    }),
    []
  )

  const visibleProjects = useMemo(
    () =>
      filter === 'All'
        ? projects
        : projects.filter((p) => p.status === filter),
    [filter]
  )

  return (
    <>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Projects</h2>
            <p className='text-muted-foreground'>
              Track active, completed, and archived workspace projects.
            </p>
          </div>
          <Button>
            <Plus className='h-4 w-4' />
            New Project
          </Button>
        </div>

        <ProjectFilterTabs
          value={filter}
          counts={counts}
          onChange={setFilter}
        />

        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {visibleProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </Main>
    </>
  )
}
