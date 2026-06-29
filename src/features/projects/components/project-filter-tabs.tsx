import { memo } from 'react'
import { cn } from '@/lib/utils'
import { type ProjectFilter } from '../types/project'

type ProjectFilterTabsProps = {
  value: ProjectFilter
  counts: Record<ProjectFilter, number>
  onChange: (value: ProjectFilter) => void
}

const TABS: ProjectFilter[] = ['All', 'Active', 'Completed', 'Archived']

export const ProjectFilterTabs = memo(function ProjectFilterTabs({
  value,
  counts,
  onChange,
}: ProjectFilterTabsProps) {
  return (
    <div className='flex items-center gap-1 border-b border-[var(--bdr)]'>
      {TABS.map((tab) => {
        const active = value === tab
        return (
          <button
            key={tab}
            type='button'
            onClick={() => onChange(tab)}
            aria-pressed={active}
            className={cn(
              '-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2 text-[13px] transition-colors',
              active
                ? 'border-[var(--pri)] font-semibold text-[var(--t1)]'
                : 'border-transparent text-[var(--t2)] hover:text-[var(--t1)]'
            )}
          >
            {tab}
            <span
              className={cn(
                'rounded-full px-1.5 text-[11px] tabular-nums',
                active
                  ? 'bg-[var(--pris)] text-[var(--pri)]'
                  : 'bg-[var(--sur3)] text-[var(--t3)]'
              )}
            >
              {counts[tab]}
            </span>
          </button>
        )
      })}
    </div>
  )
})
ProjectFilterTabs.displayName = 'ProjectFilterTabs'
