import { memo } from 'react'
import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import {
  type OrgPlan,
  type OrgStatus,
  type Organization,
} from '../types/organization'

type OrganizationsTableProps = {
  organizations: Organization[]
}

const PLAN_BADGE: Record<OrgPlan, string> = {
  Enterprise: 'bg-[var(--infos)] text-[var(--info)]',
  Professional: 'bg-[var(--oks)] text-[var(--ok)]',
  Standard: 'bg-[var(--sur3)] text-[var(--t2)]',
}

const STATUS_BADGE: Record<OrgStatus, string> = {
  Active: 'bg-[var(--oks)] text-[var(--ok)]',
  Suspended: 'bg-[var(--errs)] text-[var(--err)]',
}

function Pill({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[12px] font-medium',
        className
      )}
    >
      {children}
    </span>
  )
}

export const OrganizationsTable = memo(function OrganizationsTable({
  organizations,
}: OrganizationsTableProps) {
  return (
    <div className='overflow-x-auto rounded-[10px] border border-[var(--bdr)] bg-[var(--sur)]'>
      <table className='w-full border-collapse text-[13.5px]'>
        <thead>
          <tr className='border-b border-[var(--bdr)] bg-[var(--sur2)]'>
            {['Organization', 'Plan', 'Members', 'Status', 'Admin', 'Created'].map(
              (header) => (
                <th
                  key={header}
                  className='px-[14px] py-[10px] text-left text-[11px] font-semibold tracking-[0.07em] text-[var(--t3)] uppercase'
                >
                  {header}
                </th>
              )
            )}
            <th className='px-[14px] py-[10px]' />
          </tr>
        </thead>
        <tbody>
          {organizations.map((org) => (
            <tr
              key={org.id}
              className='border-b border-[var(--bdr)] transition-colors last:border-b-0 hover:bg-[var(--sur2)]'
            >
              <td className='px-[14px] py-[12px]'>
                <div className='flex items-center gap-3'>
                  <div
                    className='flex h-9 w-9 items-center justify-center rounded-lg text-[12px] font-semibold text-white'
                    style={{ backgroundColor: org.logoColor }}
                    aria-hidden
                  >
                    {org.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className='font-medium text-[var(--t1)]'>{org.name}</div>
                    <div className='font-mono text-[12px] text-[var(--t3)]'>
                      {org.slug}
                    </div>
                  </div>
                </div>
              </td>
              <td className='px-[14px] py-[12px]'>
                <Pill className={PLAN_BADGE[org.plan]}>{org.plan}</Pill>
              </td>
              <td className='px-[14px] py-[12px] tabular-nums text-[var(--t1)]'>
                {org.members.toLocaleString()}
              </td>
              <td className='px-[14px] py-[12px]'>
                <Pill className={STATUS_BADGE[org.status]}>{org.status}</Pill>
              </td>
              <td className='px-[14px] py-[12px] text-[var(--t2)]'>{org.admin}</td>
              <td className='px-[14px] py-[12px] text-[var(--t2)]'>{org.created}</td>
              <td className='px-[14px] py-[12px]'>
                <div className='flex justify-end'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type='button'
                        aria-label={`Open ${org.name} menu`}
                        className='inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--t2)] transition-colors hover:bg-[var(--sur3)] hover:text-[var(--t1)]'
                      >
                        <MoreHorizontal className='h-4 w-4' />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuItem>Manage members</DropdownMenuItem>
                      <DropdownMenuItem>Change plan</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant='destructive'>
                        Suspend
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})
OrganizationsTable.displayName = 'OrganizationsTable'
