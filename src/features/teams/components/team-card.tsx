import { memo } from 'react'
import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type Team } from '../types/team'

type TeamCardProps = {
  team: Team
}

function getTeamInitials(name: string): string {
  return name.slice(0, 2).toUpperCase()
}

export const TeamCard = memo(function TeamCard({ team }: TeamCardProps) {
  return (
    <div className='rounded-[10px] border border-[var(--bdr)] bg-[var(--sur)] p-5 transition-colors hover:bg-[var(--sur2)]'>
      <div className='flex items-start justify-between'>
        <div className='flex items-center gap-3'>
          <div
            className='flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold text-white'
            style={{ backgroundColor: team.color }}
            aria-hidden
          >
            {getTeamInitials(team.name)}
          </div>
          <h3 className='text-base font-semibold text-[var(--t1)]'>
            {team.name}
          </h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type='button'
              className='flex h-8 w-8 items-center justify-center rounded-md text-[var(--t2)] transition-colors hover:bg-[var(--sur3)] hover:text-[var(--t1)]'
              aria-label={`Open ${team.name} menu`}
            >
              <MoreHorizontal className='h-4 w-4' />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem>View team</DropdownMenuItem>
            <DropdownMenuItem>Edit team</DropdownMenuItem>
            <DropdownMenuItem>Manage members</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant='destructive'>
              Delete team
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className='mt-4 text-[13px] leading-relaxed text-[var(--t2)]'>
        {team.description}
      </p>

      <div className='mt-4 border-t border-[var(--bdr)] pt-4'>
        <div className='flex items-end justify-between'>
          <div className='flex gap-6'>
            <div>
              <div className='text-lg font-bold text-[var(--t1)] tabular-nums'>
                {team.members}
              </div>
              <div className='text-xs text-[var(--t3)]'>Members</div>
            </div>
            <div>
              <div className='text-lg font-bold text-[var(--t1)] tabular-nums'>
                {team.projects}
              </div>
              <div className='text-xs text-[var(--t3)]'>Projects</div>
            </div>
          </div>
          <div className='text-[13px] text-[var(--t2)]'>{team.lead}</div>
        </div>
      </div>
    </div>
  )
})
TeamCard.displayName = 'TeamCard'
