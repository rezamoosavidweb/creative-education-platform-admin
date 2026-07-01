import { Link } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { Eye } from 'lucide-react'
import {
  getAuthUserDisplayName,
  getAuthUserEmail,
  getAuthUserRoleLabel,
} from '@/lib/auth'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { StatusPill } from '@/components/status-pill'
import type { AdminUser } from '../types'

export const usersColumns: ColumnDef<AdminUser>[] = [
  {
    id: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
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
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone' />
    ),
    cell: ({ row }) => (
      <span className='text-sm text-muted-foreground'>
        {row.original.phone || 'Not provided'}
      </span>
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
      <Button variant='ghost' size='icon' asChild>
        <Link
          to='/users/$userId'
          params={{ userId: row.original.id }}
          aria-label={`View ${getAuthUserDisplayName(row.original)}`}
        >
          <Eye className='size-4' />
        </Link>
      </Button>
    ),
    enableHiding: false,
    enableSorting: false,
  },
]

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}
