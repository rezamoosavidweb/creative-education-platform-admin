import { useMemo, useState } from 'react'
import type {
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState,
  TableOptions,
  Updater,
  VisibilityState,
} from '@tanstack/react-table'
import type { ApiError } from '@/lib/api'
import type { CursorListResult, ServerListResult } from '@/lib/query'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'

type SearchRecord = Record<string, unknown>

type ServerTablePaginationMode = 'page' | 'cursor' | 'offset'

type ServerTablePaginationConfig = {
  cursor?: string | null
  cursorKey?: string
  defaultPage?: number
  defaultPageSize?: number
  mode?: ServerTablePaginationMode
  offsetKey?: string
  pageKey?: string
  pageSizeKey?: string
}

type ServerTableSearchConfig = {
  debounceMs?: number
  enabled?: boolean
  key?: string
  trim?: boolean
}

type ServerTableSortConfig = {
  defaultSorting?: SortingState
  directionKey?: string
  fieldKey?: string
  serializeDirection?: (desc: boolean) => unknown
}

export type ServerTableColumnFilterConfig = {
  columnId: string
  searchKey: string
  type?: 'array' | 'string'
  serialize?: (value: unknown) => unknown
  deserialize?: (value: unknown) => unknown
}

export type ServerTableQueryParams = Record<string, unknown>

export type ServerTableStateParams = {
  columnFilters?: ServerTableColumnFilterConfig[]
  navigate: NavigateFn
  pagination?: ServerTablePaginationConfig
  search: SearchRecord
  serverSearch?: ServerTableSearchConfig
  sorting?: ServerTableSortConfig
}

export type ServerTableState = {
  columnFilters: ColumnFiltersState
  columnVisibility: VisibilityState
  debouncedGlobalFilter?: string
  globalFilter?: string
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>
  onColumnVisibilityChange: OnChangeFn<VisibilityState>
  onGlobalFilterChange?: OnChangeFn<string>
  onPaginationChange: OnChangeFn<PaginationState>
  onRowSelectionChange: OnChangeFn<RowSelectionState>
  onSortingChange: OnChangeFn<SortingState>
  pagination: PaginationState
  query: ServerTableQueryParams
  rowSelection: RowSelectionState
  sorting: SortingState
}

export type ServerTableMeta = {
  hasNextPage: boolean
  hasPreviousPage: boolean
  nextCursor: string | null
  pageCount: number
  rowCount: number
}

export type ServerTableStatus = {
  error: ApiError | null
  isEmpty: boolean
  isError: boolean
  isLoading: boolean
  isRefreshing: boolean
  refresh: () => void
}

export function useServerTableState({
  columnFilters: columnFilterConfig = [],
  navigate,
  pagination: paginationConfig,
  search,
  serverSearch,
  sorting: sortingConfig,
}: ServerTableStateParams): ServerTableState {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const { sorting, onSortingChange } = useUrlSortingState({
    config: sortingConfig,
    navigate,
    paginationConfig,
    search,
  })

  const {
    columnFilters,
    globalFilter,
    onColumnFiltersChange,
    onGlobalFilterChange,
    onPaginationChange,
    pagination,
  } = useTableUrlState({
    columnFilters: columnFilterConfig,
    globalFilter: {
      enabled: serverSearch?.enabled ?? true,
      key: serverSearch?.key ?? 'q',
      trim: serverSearch?.trim ?? true,
    },
    navigate,
    pagination: {
      defaultPage: paginationConfig?.defaultPage ?? 1,
      defaultPageSize: paginationConfig?.defaultPageSize ?? 10,
      pageKey: paginationConfig?.pageKey ?? 'page',
      pageSizeKey: paginationConfig?.pageSizeKey ?? 'take',
    },
    search,
  })

  const debouncedGlobalFilter = useDebouncedValue(
    globalFilter,
    serverSearch?.debounceMs ?? 300
  )

  const query = useMemo(
    () =>
      buildServerTableQuery({
        columnFilters,
        columnFiltersConfig: columnFilterConfig,
        globalFilter: debouncedGlobalFilter,
        pagination,
        paginationConfig,
        serverSearch,
        sorting,
        sortingConfig,
      }),
    [
      columnFilterConfig,
      columnFilters,
      debouncedGlobalFilter,
      pagination,
      paginationConfig,
      serverSearch,
      sorting,
      sortingConfig,
    ]
  )

  return {
    columnFilters,
    columnVisibility,
    debouncedGlobalFilter,
    globalFilter,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange,
    onPaginationChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange,
    pagination,
    query,
    rowSelection,
    sorting,
  }
}

export function getServerTableOptions<TData>({
  columns,
  data,
  meta,
  state,
}: {
  columns: TableOptions<TData>['columns']
  data: TData[]
  meta: ServerTableMeta
  state: ServerTableState
}): Pick<
  TableOptions<TData>,
  | 'columns'
  | 'data'
  | 'enableRowSelection'
  | 'manualFiltering'
  | 'manualPagination'
  | 'manualSorting'
  | 'onColumnFiltersChange'
  | 'onColumnVisibilityChange'
  | 'onGlobalFilterChange'
  | 'onPaginationChange'
  | 'onRowSelectionChange'
  | 'onSortingChange'
  | 'pageCount'
  | 'rowCount'
  | 'state'
> {
  return {
    columns,
    data,
    enableRowSelection: true,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    onColumnFiltersChange: state.onColumnFiltersChange,
    onColumnVisibilityChange: state.onColumnVisibilityChange,
    onGlobalFilterChange: state.onGlobalFilterChange,
    onPaginationChange: state.onPaginationChange,
    onRowSelectionChange: state.onRowSelectionChange,
    onSortingChange: state.onSortingChange,
    pageCount: meta.pageCount,
    rowCount: meta.rowCount,
    state: {
      columnFilters: state.columnFilters,
      columnVisibility: state.columnVisibility,
      globalFilter: state.globalFilter,
      pagination: state.pagination,
      rowSelection: state.rowSelection,
      sorting: state.sorting,
    },
  }
}

export function buildServerTableQuery({
  columnFilters,
  columnFiltersConfig,
  globalFilter,
  pagination,
  paginationConfig,
  serverSearch,
  sorting,
  sortingConfig,
}: {
  columnFilters: ColumnFiltersState
  columnFiltersConfig?: ServerTableColumnFilterConfig[]
  globalFilter?: string
  pagination: PaginationState
  paginationConfig?: ServerTablePaginationConfig
  serverSearch?: ServerTableSearchConfig
  sorting: SortingState
  sortingConfig?: ServerTableSortConfig
}): ServerTableQueryParams {
  const mode = paginationConfig?.mode ?? 'page'
  const query: ServerTableQueryParams = {}
  const pageSizeKey = paginationConfig?.pageSizeKey ?? 'take'

  if (mode === 'cursor') {
    query[pageSizeKey] = pagination.pageSize
    if (paginationConfig?.cursor) {
      query[paginationConfig.cursorKey ?? 'cursor'] = paginationConfig.cursor
    }
  } else if (mode === 'offset') {
    query[pageSizeKey] = pagination.pageSize
    query[paginationConfig?.offsetKey ?? 'offset'] =
      pagination.pageIndex * pagination.pageSize
  } else {
    query[paginationConfig?.pageKey ?? 'page'] = pagination.pageIndex + 1
    query[pageSizeKey] = pagination.pageSize
  }

  if (globalFilter) {
    query[serverSearch?.key ?? 'q'] = globalFilter
  }

  for (const filterConfig of columnFiltersConfig ?? []) {
    const filter = columnFilters.find(
      (candidate) => candidate.id === filterConfig.columnId
    )
    if (!filter) continue

    const value = filterConfig.serialize
      ? filterConfig.serialize(filter.value)
      : filter.value
    if (isPresentFilterValue(value)) {
      query[filterConfig.searchKey] = value
    }
  }

  const sort = sorting[0]
  if (sort) {
    query[sortingConfig?.fieldKey ?? 'sortBy'] = sort.id
    query[sortingConfig?.directionKey ?? 'order'] =
      sortingConfig?.serializeDirection?.(sort.desc) ??
      (sort.desc ? 'DESC' : 'ASC')
  }

  return stripEmptyValues(query)
}

export function getPageServerTableMeta<Item, Raw>(
  list: ServerListResult<Item, Raw> | undefined
): ServerTableMeta {
  return {
    hasNextPage: list?.hasNextPage ?? false,
    hasPreviousPage: list?.hasPreviousPage ?? false,
    nextCursor: null,
    pageCount: list?.pageCount ?? 0,
    rowCount: list?.total ?? 0,
  }
}

export function getCursorServerTableMeta<Item, Raw>(
  list: CursorListResult<Item, Raw> | undefined
): ServerTableMeta {
  return {
    hasNextPage: list?.hasNextPage ?? false,
    hasPreviousPage: false,
    nextCursor: list?.nextCursor ?? null,
    pageCount: list?.hasNextPage ? -1 : 1,
    rowCount: list?.total ?? list?.items.length ?? 0,
  }
}

export function getServerTableStatus({
  error,
  isFetching,
  isLoading,
  itemCount,
  refetch,
}: {
  error: ApiError | null | undefined
  isFetching: boolean
  isLoading: boolean
  itemCount: number
  refetch: () => Promise<unknown> | void
}): ServerTableStatus {
  return {
    error: error ?? null,
    isEmpty: !isLoading && !error && itemCount === 0,
    isError: !!error,
    isLoading,
    isRefreshing: isFetching && !isLoading,
    refresh: () => {
      void refetch()
    },
  }
}

function useUrlSortingState({
  config,
  navigate,
  paginationConfig,
  search,
}: {
  config?: ServerTableSortConfig
  navigate: NavigateFn
  paginationConfig?: ServerTablePaginationConfig
  search: SearchRecord
}): {
  onSortingChange: OnChangeFn<SortingState>
  sorting: SortingState
} {
  const fieldKey = config?.fieldKey ?? 'sortBy'
  const directionKey = config?.directionKey ?? 'order'
  const rawField = search[fieldKey]
  const rawDirection = search[directionKey]
  const sorting =
    typeof rawField === 'string'
      ? [
          {
            desc: String(rawDirection).toUpperCase() === 'DESC',
            id: rawField,
          },
        ]
      : (config?.defaultSorting ?? [])

  const onSortingChange: OnChangeFn<SortingState> = (updater) => {
    const next = resolveUpdater(updater, sorting)
    const firstSort = next[0]

    navigate({
      search: (prev) => ({
        ...(prev as SearchRecord),
        [paginationConfig?.cursorKey ?? 'cursor']: undefined,
        [directionKey]: firstSort
          ? (config?.serializeDirection?.(firstSort.desc) ??
            (firstSort.desc ? 'DESC' : 'ASC'))
          : undefined,
        [fieldKey]: firstSort?.id,
        [paginationConfig?.offsetKey ?? 'offset']: undefined,
        [paginationConfig?.pageKey ?? 'page']: undefined,
      }),
    })
  }

  return { onSortingChange, sorting }
}

function resolveUpdater<TValue>(
  updater: Updater<TValue>,
  previous: TValue
): TValue {
  return typeof updater === 'function'
    ? (updater as (old: TValue) => TValue)(previous)
    : updater
}

function isPresentFilterValue(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'string') return value.trim().length > 0
  return value !== undefined && value !== null
}

function stripEmptyValues(
  query: ServerTableQueryParams
): ServerTableQueryParams {
  return Object.fromEntries(
    Object.entries(query).filter(([, value]) => isPresentFilterValue(value))
  )
}
