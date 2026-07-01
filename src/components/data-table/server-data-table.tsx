import type { ReactNode } from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ApiEmpty,
  ApiError,
  ApiLoading,
  CursorPagination,
} from '@/components/api'
import { DataTablePagination } from './pagination'
import {
  getServerTableOptions,
  type ServerTableMeta,
  type ServerTableState,
  type ServerTableStatus,
} from './server-table'
import { DataTableToolbar } from './toolbar'

type ServerDataTableToolbarConfig<TData> = {
  filters?: Parameters<typeof DataTableToolbar<TData>>[0]['filters']
  searchKey?: string
  searchPlaceholder?: string
}

type CursorPaginationConfig = {
  onNext: (cursor: string) => void
  onPrevious?: () => void
}

type ServerDataTableProps<TData, TValue = unknown> = {
  bulkActions?: (table: ReturnType<typeof useReactTable<TData>>) => ReactNode
  className?: string
  columns: ColumnDef<TData, TValue>[]
  cursorPagination?: CursorPaginationConfig
  data: TData[]
  emptyDescription?: string
  emptyTitle?: string
  getRowId?: (row: TData, index: number) => string
  meta: ServerTableMeta
  state: ServerTableState
  status: ServerTableStatus
  toolbar?: ServerDataTableToolbarConfig<TData>
}

export function ServerDataTable<TData, TValue = unknown>({
  bulkActions,
  className,
  columns,
  cursorPagination,
  data,
  emptyDescription,
  emptyTitle,
  getRowId,
  meta,
  state,
  status,
  toolbar,
}: ServerDataTableProps<TData, TValue>) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    ...getServerTableOptions({
      columns,
      data,
      meta,
      state,
    }),
    getCoreRowModel: getCoreRowModel(),
    getRowId,
  })
  const colSpan = Math.max(columns.length, 1)

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16',
        'flex flex-1 flex-col gap-4',
        className
      )}
    >
      {toolbar && (
        <DataTableToolbar
          table={table}
          searchPlaceholder={toolbar.searchPlaceholder}
          searchKey={toolbar.searchKey}
          filters={toolbar.filters}
        />
      )}
      <div className='overflow-hidden rounded-md border bg-card'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='group/row'>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      'bg-muted',
                      header.column.columnDef.meta?.className,
                      header.column.columnDef.meta?.thClassName
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {status.isLoading && (
              <TableRow>
                <TableCell colSpan={colSpan}>
                  <ApiLoading label='Loading data...' />
                </TableCell>
              </TableRow>
            )}
            {status.isError && (
              <TableRow>
                <TableCell colSpan={colSpan}>
                  <ApiError error={status.error} onRetry={status.refresh} />
                </TableCell>
              </TableRow>
            )}
            {status.isEmpty && (
              <TableRow>
                <TableCell colSpan={colSpan}>
                  <ApiEmpty title={emptyTitle} description={emptyDescription} />
                </TableCell>
              </TableRow>
            )}
            {!status.isLoading &&
              !status.isError &&
              !status.isEmpty &&
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='group/row'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'bg-card group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                        cell.column.columnDef.meta?.className,
                        cell.column.columnDef.meta?.tdClassName
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      {cursorPagination ? (
        <CursorPagination
          hasNextPage={meta.hasNextPage}
          hasPreviousPage={meta.hasPreviousPage}
          isRefreshing={status.isRefreshing}
          nextCursor={meta.nextCursor}
          onNext={cursorPagination.onNext}
          onPrevious={cursorPagination.onPrevious}
          onRefresh={status.refresh}
        />
      ) : (
        <DataTablePagination table={table} className='mt-auto' />
      )}
      {bulkActions?.(table)}
    </div>
  )
}
