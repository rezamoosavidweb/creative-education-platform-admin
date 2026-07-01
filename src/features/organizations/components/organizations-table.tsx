import { memo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Eye, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  DataTableColumnHeader,
  getServerTableStatus,
  ServerDataTable,
  useServerTableState,
} from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type NavigateFn } from '@/hooks/use-table-url-state'
import { useOrganizationsList } from '../hooks/use-organizations-list'
import {
  formatOrganizationDate,
  getArrayServerTableMeta,
  getOrganizationItems,
} from '../services/organizations-query'
import type { Organization } from '../types'
import { OrganizationDetailsDialog } from './organization-details-dialog'

type OrganizationsTableProps = {
  navigate: NavigateFn
  search: Record<string, unknown>
}

export const OrganizationsTable = memo(function OrganizationsTable({
  navigate,
  search,
}: OrganizationsTableProps) {
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null)
  const organizationsQuery = useOrganizationsList()
  const organizations = getOrganizationItems(organizationsQuery.data?.data)
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

  return (
    <>
      <ServerDataTable
        columns={createOrganizationColumns({
          onViewDetails: setSelectedOrganization,
        })}
        data={organizations}
        emptyDescription='The backend returned no organizations for the current user.'
        emptyTitle='No organizations'
        getRowId={(row) => row.id}
        meta={getArrayServerTableMeta(organizations)}
        state={tableState}
        status={getServerTableStatus({
          error: organizationsQuery.error,
          isFetching: organizationsQuery.isFetching,
          isLoading: organizationsQuery.isLoading,
          itemCount: organizations.length,
          refetch: organizationsQuery.refetch,
        })}
      />

      <OrganizationDetailsDialog
        open={!!selectedOrganization}
        organization={selectedOrganization}
        onOpenChange={(open) => {
          if (!open) setSelectedOrganization(null)
        }}
      />
    </>
  )
})
OrganizationsTable.displayName = 'OrganizationsTable'

function createOrganizationColumns({
  onViewDetails,
}: {
  onViewDetails: (organization: Organization) => void
}): ColumnDef<Organization>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Organization' />
      ),
      cell: ({ row }) => (
        <div className='flex items-center gap-3 ps-3'>
          <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--sur3)] text-[12px] font-semibold text-[var(--t2)]'>
            {row.original.name.slice(0, 2).toUpperCase()}
          </div>
          <div className='min-w-0'>
            <div className='font-medium text-[var(--t1)]'>
              {row.original.name}
            </div>
            <LongText className='max-w-56 font-mono text-[12px] text-[var(--t3)]'>
              {row.original.id}
            </LongText>
          </div>
        </div>
      ),
      enableHiding: false,
      enableSorting: false,
      meta: {
        className:
          'inset-s-0 ps-0.5 max-md:sticky @4xl/content:table-cell',
      },
    },
    {
      accessorKey: 'type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Type' />
      ),
      cell: ({ row }) => (
        <span className='text-sm text-[var(--t1)]'>{row.original.type}</span>
      ),
      enableSorting: false,
    },
    {
      id: 'disciplines',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Disciplines' />
      ),
      cell: ({ row }) => (
        <span className='tabular-nums text-[var(--t1)]'>
          {row.original.disciplineIds.length.toLocaleString()}
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Created' />
      ),
      cell: ({ row }) => (
        <span className='text-sm text-muted-foreground'>
          {formatOrganizationDate(row.original.createdAt)}
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Updated' />
      ),
      cell: ({ row }) => (
        <span className='text-sm text-muted-foreground'>
          {formatOrganizationDate(row.original.updatedAt)}
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
                aria-label={`Open ${row.original.name} menu`}
              >
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => onViewDetails(row.original)}>
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
