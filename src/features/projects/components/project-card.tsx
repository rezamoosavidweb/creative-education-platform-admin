import { memo } from 'react'
import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getAvatarColor } from '@/lib/avatar'
import { cn } from '@/lib/utils'
import { type Project, type ProjectStatus } from '../types/project'

type ProjectCardProps = {
  project: Project
}

const STATUS_BADGE: Record<ProjectStatus, string> = {
  Active: 'bg-[var(--oks)] text-[var(--ok)]',
  Completed: 'bg-[var(--infos)] text-[var(--info)]',
  Archived: 'bg-[var(--sur3)] text-[var(--t2)]',
}

export const ProjectCard = memo(function ProjectCard({
  project,
}: ProjectCardProps) {
  return (
    <div className='flex flex-col rounded-[10px] border border-[var(--bdr)] bg-[var(--sur)] p-5 transition-colors hover:bg-[var(--sur2)]'>
      <div className='flex items-start justify-between'>
        <div className='flex items-center gap-2.5'>
          <span
            className='h-2.5 w-2.5 shrink-0 rounded-full'
            style={{ backgroundColor: project.color }}
          />
          <h3 className='font-semibold text-[var(--t1)]'>{project.name}</h3>
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium',
              STATUS_BADGE[project.status]
            )}
          >
            {project.status}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type='button'
              aria-label={`Open ${project.name} menu`}
              className='inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--t2)] transition-colors hover:bg-[var(--sur3)] hover:text-[var(--t1)]'
            >
              <MoreHorizontal className='h-4 w-4' />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem>Open project</DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant='destructive'>Archive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className='mt-3 line-clamp-2 text-[12.5px] leading-relaxed text-[var(--t2)]'>
        {project.description}
      </p>

      <div className='mt-4'>
        <div className='mb-1.5 flex items-center justify-between text-[12px]'>
          <span className='text-[var(--t3)]'>Progress</span>
          <span className='font-medium text-[var(--t1)] tabular-nums'>
            {project.progress}%
          </span>
        </div>
        <div className='h-1 overflow-hidden rounded-full bg-[var(--sur3)]'>
          <div
            className='h-full rounded-full transition-[width]'
            style={{ width: `${project.progress}%`, backgroundColor: project.color }}
          />
        </div>
      </div>

      <div className='mt-4 flex items-center justify-between'>
        <div className='flex items-center'>
          {project.team.map((initials, index) => (
            <span
              key={initials}
              className={cn(
                'flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-[var(--sur)] text-[10px] font-semibold text-white',
                index > 0 && '-ml-1.5'
              )}
              style={{ backgroundColor: getAvatarColor(initials) }}
            >
              {initials}
            </span>
          ))}
          <span className='ml-2 text-[12px] text-[var(--t3)]'>
            {project.tasksDone}/{project.tasks} tasks
          </span>
        </div>
        <span className='text-[12px] text-[var(--t3)]'>{project.dueDate}</span>
      </div>
    </div>
  )
})
ProjectCard.displayName = 'ProjectCard'
