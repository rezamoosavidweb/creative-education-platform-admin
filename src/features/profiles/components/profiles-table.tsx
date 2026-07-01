import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Eye, MoreHorizontal } from 'lucide-react'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  DataTableColumnHeader,
  getServerTableStatus,
  ServerDataTable,
  useServerTableState,
} from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { StatusPill } from '@/components/status-pill'
import { useDirectoryProfiles } from '../hooks/use-directory-profiles'
import {
  getDirectoryEntries,
  getDirectoryTableMeta,
} from '../services/profiles-query'
import type { DirectoryEntry, DirectoryQuery } from '../types'
import { DirectoryFilters } from './directory-filters'
import { ProfileDetailsDialog } from './profile-details-dialog'

type ProfilesTableProps = {
  navigate: NavigateFn
  search: Record<string, unknown>
}

export function ProfilesTable({ navigate, search }: ProfilesTableProps) {
  const [selectedHandle, setSelectedHandle] = useState<string | null>(null)
  const tableState = useServerTableState({
    navigate,
    pagination: {
      defaultPage: 1,
      defaultPageSize: 10,
      pageKey: 'page',
      pageSizeKey: 'take',
    },
    search,
    serverSearch: {
      enabled: false,
    },
  })
  const directoryQuery = useDirectoryProfiles({
    availableForHire: readDirectoryFilter(search.availableForHire),
    country: readCountry(search.country),
    verified: readDirectoryFilter(search.verified),
  })
  const entries = getDirectoryEntries(directoryQuery.data?.data)

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <DirectoryFilters navigate={navigate} search={search} />
      <ServerDataTable
        columns={createProfileColumns({
          onViewDetails: setSelectedHandle,
        })}
        data={entries}
        emptyDescription='No published profiles match these filters.'
        emptyTitle='No profiles'
        getRowId={(row) => row.handle}
        meta={getDirectoryTableMeta(entries)}
        state={tableState}
        status={getServerTableStatus({
          error: directoryQuery.error,
          isFetching: directoryQuery.isFetching,
          isLoading: directoryQuery.isLoading,
          itemCount: entries.length,
          refetch: directoryQuery.refetch,
        })}
      />
      <ProfileDetailsDialog
        handle={selectedHandle}
        open={!!selectedHandle}
        onOpenChange={(open) => {
          if (!open) setSelectedHandle(null)
        }}
      />
    </div>
  )
}

function createProfileColumns({
  onViewDetails,
}: {
  onViewDetails: (handle: string) => void
}): ColumnDef<DirectoryEntry>[] {
  return [
    {
      accessorKey: 'displayName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Profile' />
      ),
      cell: ({ row }) => (
        <div className='flex items-center gap-3 ps-3'>
          <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--sur3)] text-[12px] font-semibold text-[var(--t2)]'>
            {(row.original.displayName ?? row.original.handle)
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div className='min-w-0'>
            <div className='font-medium text-[var(--t1)]'>
              {row.original.displayName ?? row.original.handle}
            </div>
            <LongText className='max-w-56 font-mono text-[12px] text-[var(--t3)]'>
              @{row.original.handle}
            </LongText>
          </div>
        </div>
      ),
      enableSorting: false,
      meta: {
        className: 'inset-s-0 ps-0.5 max-md:sticky @4xl/content:table-cell',
      },
    },
    {
      id: 'location',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Location' />
      ),
      cell: ({ row }) =>
        [row.original.city, row.original.region, row.original.country]
          .filter(Boolean)
          .join(', ') || 'None',
      enableSorting: false,
    },
    {
      accessorKey: 'availableForHire',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Available' />
      ),
      cell: ({ row }) => (
        <StatusPill tone={row.original.availableForHire ? 'ok' : 'neutral'}>
          {row.original.availableForHire ? 'Yes' : 'No'}
        </StatusPill>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'verified',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Verified' />
      ),
      cell: ({ row }) => (
        <StatusPill tone={row.original.verified ? 'ok' : 'warn'}>
          {row.original.verified ? 'Verified' : 'Unverified'}
        </StatusPill>
      ),
      enableSorting: false,
    },
    {
      id: 'references',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='References' />
      ),
      cell: ({ row }) => (
        <span className='text-sm text-muted-foreground'>
          {(
            row.original.disciplineIds.length +
            row.original.specializationIds.length +
            row.original.genreIds.length +
            row.original.skillIds.length
          ).toLocaleString()}
        </span>
      ),
      enableSorting: false,
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className='flex justify-end'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                aria-label={`Open ${row.original.handle} menu`}
              >
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem
                onClick={() => onViewDetails(row.original.handle)}
              >
                <Eye className='size-4' />
                View details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      enableHiding: false,
      enableSorting: false,
    },
  ]
}

function readCountry(value: unknown): DirectoryQuery['country'] {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : undefined
}

function readDirectoryFilter(value: unknown): string | undefined {
  if (value === true) return 'true'
  if (value === false) return 'false'
  if (value === '"true"') return 'true'
  if (value === '"false"') return 'false'
  return value === 'true' || value === 'false' ? value : undefined
}
