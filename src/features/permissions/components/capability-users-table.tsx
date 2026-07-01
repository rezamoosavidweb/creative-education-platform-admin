import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { ShieldCheck } from 'lucide-react'
import {
  getAuthUserDisplayName,
  getAuthUserEmail,
  getAuthUserRoleLabel,
} from '@/lib/auth'
import { CapabilityGate } from '@/lib/capabilities'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DataTableColumnHeader,
  getPageServerTableMeta,
  getServerTableStatus,
  ServerDataTable,
  useServerTableState,
} from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { StatusPill } from '@/components/status-pill'
import { useUsersList } from '@/features/users/hooks/use-users-list'
import { toUsersListQuery } from '@/features/users/services/users-query'
import { type NavigateFn } from '@/hooks/use-table-url-state'
import {
  CAPABILITY_MANAGEMENT_CAPABILITY,
} from '../services/capabilities-query'
import type { CapabilityUser } from '../types'

type CapabilityUsersTableProps = {
  navigate: NavigateFn
  onManageUser: (user: CapabilityUser) => void
  search: Record<string, unknown>
}

export function CapabilityUsersTable({
  navigate,
  onManageUser,
  search,
}: CapabilityUsersTableProps) {
  const columns = useMemo(
    () => createCapabilityUserColumns(onManageUser),
    [onManageUser]
  )
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
      debounceMs: 300,
      enabled: true,
      key: 'q',
    },
    sorting: {
      defaultSorting: [{ desc: true, id: 'createdAt' }],
      directionKey: 'order',
      fieldKey: 'sortBy',
      serializeDirection: (desc) => (desc ? 'DESC' : 'ASC'),
    },
  })
  const usersQuery = useUsersList(toUsersListQuery(tableState.query))
  const list = usersQuery.data
  const rows = list?.items ?? []

  return (
    <ServerDataTable
      columns={columns}
      data={rows}
      emptyDescription='No users match the current capability search.'
      emptyTitle='No users found'
      getRowId={(row) => row.id}
      meta={getPageServerTableMeta(list)}
      state={tableState}
      status={getServerTableStatus({
        error: usersQuery.error,
        isFetching: usersQuery.isFetching,
        isLoading: usersQuery.isLoading,
        itemCount: rows.length,
        refetch: usersQuery.refetch,
      })}
      toolbar={{
        searchPlaceholder: 'Search users...',
      }}
    />
  )
}

function createCapabilityUserColumns(
  onManageUser: (user: CapabilityUser) => void
): ColumnDef<CapabilityUser>[] {
  return [
    {
      id: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='User' />
      ),
      cell: ({ row }) => (
        <LongText className='max-w-48 ps-3'>
          {getAuthUserDisplayName(row.original)}
        </LongText>
      ),
      enableHiding: false,
      enableSorting: false,
      meta: {
        className: cn(
          'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
          'inset-s-0 ps-0.5 max-md:sticky @4xl/content:table-cell @4xl/content:drop-shadow-none'
        ),
      },
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Email' />
      ),
      cell: ({ row }) => (
        <LongText className='max-w-56'>
          {getAuthUserEmail(row.original)}
        </LongText>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Role' />
      ),
      cell: ({ row }) => (
        <span className='text-sm'>{getAuthUserRoleLabel(row.original)}</span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'isActive',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }) =>
        row.original.isActive === false ? (
          <StatusPill tone='err'>Inactive</StatusPill>
        ) : row.original.isActive === true ? (
          <StatusPill tone='ok'>Active</StatusPill>
        ) : (
          <StatusPill tone='neutral'>Unknown</StatusPill>
        ),
      enableHiding: false,
      enableSorting: false,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Created' />
      ),
      cell: ({ row }) => (
        <span className='text-sm text-muted-foreground'>
          {formatDateTime(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <CapabilityGate
          requiredCapabilities={CAPABILITY_MANAGEMENT_CAPABILITY}
        >
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => onManageUser(row.original)}
          >
            <ShieldCheck className='size-4' />
            Manage
          </Button>
        </CapabilityGate>
      ),
      enableHiding: false,
      enableSorting: false,
    },
  ]
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}
