import type { ColumnDef } from '@tanstack/react-table'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import {
  DataTableColumnHeader,
  getServerTableStatus,
  ServerDataTable,
  useServerTableState,
} from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { StatusPill } from '@/components/status-pill'
import type { ReferenceCatalogQuery } from '../hooks/use-reference-catalogs'
import {
  formatReferenceDate,
  getReferenceCatalogConfig,
  getReferenceTableMeta,
} from '../services/reference-query'
import type { ReferenceCatalogId, ReferenceItem } from '../types'

type ReferenceTableProps = {
  catalog: ReferenceCatalogId
  items: ReferenceItem[]
  navigate: NavigateFn
  query: ReferenceCatalogQuery
  search: Record<string, unknown>
}

export function ReferenceTable({
  catalog,
  items,
  navigate,
  query,
  search,
}: ReferenceTableProps) {
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
  const catalogConfig = getReferenceCatalogConfig(catalog)

  return (
    <ServerDataTable
      columns={referenceColumns}
      data={items}
      emptyDescription={`No ${catalogConfig.label.toLowerCase()} are available.`}
      emptyTitle={`No ${catalogConfig.label.toLowerCase()}`}
      getRowId={(row) => row.id}
      meta={getReferenceTableMeta(items)}
      state={tableState}
      status={getServerTableStatus({
        error: query.error,
        isFetching: query.isFetching,
        isLoading: query.isLoading,
        itemCount: items.length,
        refetch: query.refetch,
      })}
    />
  )
}

const referenceColumns: ColumnDef<ReferenceItem>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
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
            {row.original.slug}
          </LongText>
        </div>
      </div>
    ),
    enableHiding: false,
    enableSorting: false,
    meta: {
      className: 'inset-s-0 ps-0.5 max-md:sticky @4xl/content:table-cell',
    },
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-72 font-mono text-xs text-muted-foreground'>
        {row.original.id}
      </LongText>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'rank',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Rank' />
    ),
    cell: ({ row }) =>
      row.original.rank === undefined ? (
        <StatusPill tone='neutral'>None</StatusPill>
      ) : (
        <span className='text-[var(--t1)] tabular-nums'>
          {row.original.rank.toLocaleString()}
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
        {formatReferenceDate(row.original.createdAt)}
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
        {formatReferenceDate(row.original.updatedAt)}
      </span>
    ),
    enableSorting: false,
  },
]
