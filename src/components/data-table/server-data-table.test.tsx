import type { ColumnDef } from '@tanstack/react-table'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/lib/api'
import { ServerDataTable } from './server-data-table'
import type { ServerTableState, ServerTableStatus } from './server-table'

type Row = {
  email: string
  id: string
}

const columns: ColumnDef<Row>[] = [
  {
    accessorKey: 'email',
    header: 'Email',
  },
]

const state: ServerTableState = {
  columnFilters: [],
  columnVisibility: {},
  onColumnFiltersChange: vi.fn(),
  onColumnVisibilityChange: vi.fn(),
  onPaginationChange: vi.fn(),
  onRowSelectionChange: vi.fn(),
  onSortingChange: vi.fn(),
  pagination: { pageIndex: 0, pageSize: 10 },
  query: {},
  rowSelection: {},
  sorting: [],
}

const status: ServerTableStatus = {
  error: null,
  isEmpty: false,
  isError: false,
  isLoading: false,
  isRefreshing: false,
  refresh: vi.fn(),
}

describe('ServerDataTable', () => {
  it('renders server rows with existing table primitives', () => {
    const markup = renderToStaticMarkup(
      <ServerDataTable
        columns={columns}
        data={[{ id: '1', email: 'jordan@example.com' }]}
        meta={{
          hasNextPage: false,
          hasPreviousPage: false,
          nextCursor: null,
          pageCount: 1,
          rowCount: 1,
        }}
        state={state}
        status={status}
      />
    )

    expect(markup).toContain('jordan@example.com')
  })

  it('renders loading, empty, and error states through shared API components', () => {
    const loadingMarkup = renderToStaticMarkup(
      <ServerDataTable
        columns={columns}
        data={[]}
        meta={{
          hasNextPage: false,
          hasPreviousPage: false,
          nextCursor: null,
          pageCount: 0,
          rowCount: 0,
        }}
        state={state}
        status={{ ...status, isLoading: true }}
      />
    )
    const emptyMarkup = renderToStaticMarkup(
      <ServerDataTable
        columns={columns}
        data={[]}
        emptyTitle='Nothing here'
        meta={{
          hasNextPage: false,
          hasPreviousPage: false,
          nextCursor: null,
          pageCount: 0,
          rowCount: 0,
        }}
        state={state}
        status={{ ...status, isEmpty: true }}
      />
    )
    const errorMarkup = renderToStaticMarkup(
      <ServerDataTable
        columns={columns}
        data={[]}
        meta={{
          hasNextPage: false,
          hasPreviousPage: false,
          nextCursor: null,
          pageCount: 0,
          rowCount: 0,
        }}
        state={state}
        status={{
          ...status,
          error: new ApiError({
            kind: 'http',
            message: 'Forbidden.',
            originalError: undefined,
            status: 403,
          }),
          isError: true,
        }}
      />
    )

    expect(loadingMarkup).toContain('Loading data...')
    expect(emptyMarkup).toContain('Nothing here')
    expect(errorMarkup).toContain('Forbidden.')
  })

  it('renders cursor pagination when cursor mode is configured', () => {
    const markup = renderToStaticMarkup(
      <ServerDataTable
        columns={columns}
        cursorPagination={{ onNext: vi.fn() }}
        data={[]}
        meta={{
          hasNextPage: true,
          hasPreviousPage: false,
          nextCursor: 'cursor-2',
          pageCount: -1,
          rowCount: 0,
        }}
        state={state}
        status={{ ...status, isEmpty: true }}
      />
    )

    expect(markup).toContain('Cursor pagination')
    expect(markup).toContain('Next')
  })
})
