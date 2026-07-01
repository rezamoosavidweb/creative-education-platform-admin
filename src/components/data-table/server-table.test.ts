import { describe, expect, it, vi } from 'vitest'
import {
  buildServerTableQuery,
  getCursorServerTableMeta,
  getPageServerTableMeta,
  getServerTableStatus,
} from './server-table'

describe('server table adapter', () => {
  it('builds PageDto query params from server table state', () => {
    expect(
      buildServerTableQuery({
        columnFilters: [
          { id: 'status', value: ['active'] },
          { id: 'email', value: 'example.com' },
        ],
        columnFiltersConfig: [
          { columnId: 'status', searchKey: 'status', type: 'array' },
          { columnId: 'email', searchKey: 'email', type: 'string' },
        ],
        globalFilter: 'jordan',
        pagination: { pageIndex: 2, pageSize: 25 },
        sorting: [{ desc: true, id: 'createdAt' }],
      })
    ).toEqual({
      email: 'example.com',
      order: 'DESC',
      page: 3,
      q: 'jordan',
      sortBy: 'createdAt',
      status: ['active'],
      take: 25,
    })
  })

  it('builds cursor query params with X-Next-Cursor input', () => {
    expect(
      buildServerTableQuery({
        columnFilters: [],
        globalFilter: 'creative',
        pagination: { pageIndex: 0, pageSize: 20 },
        paginationConfig: {
          cursor: 'cursor-2',
          mode: 'cursor',
        },
        serverSearch: {
          key: 'search',
        },
        sorting: [],
      })
    ).toEqual({
      cursor: 'cursor-2',
      search: 'creative',
      take: 20,
    })
  })

  it('builds offset query params without client-side fake pagination', () => {
    expect(
      buildServerTableQuery({
        columnFilters: [],
        pagination: { pageIndex: 3, pageSize: 50 },
        paginationConfig: {
          mode: 'offset',
        },
        sorting: [],
      })
    ).toEqual({
      offset: 150,
      take: 50,
    })
  })

  it('maps PageDto metadata to manual table metadata', () => {
    expect(
      getPageServerTableMeta({
        apiResult: {
          data: {},
          headers: {},
          nextCursor: null,
          status: 200,
        },
        hasNextPage: true,
        hasPreviousPage: false,
        items: [{ id: '1' }],
        page: 1,
        pageCount: 4,
        pageSize: 10,
        raw: {},
        total: 31,
      })
    ).toEqual({
      hasNextPage: true,
      hasPreviousPage: false,
      nextCursor: null,
      pageCount: 4,
      rowCount: 31,
    })
  })

  it('maps cursor metadata and next cursor', () => {
    expect(
      getCursorServerTableMeta({
        apiResult: {
          data: {},
          headers: {},
          nextCursor: 'cursor-3',
          status: 200,
        },
        hasNextPage: true,
        items: [{ id: '1' }],
        nextCursor: 'cursor-3',
        raw: {},
        total: 11,
      })
    ).toMatchObject({
      hasNextPage: true,
      nextCursor: 'cursor-3',
      pageCount: -1,
      rowCount: 11,
    })
  })

  it('exposes loading, empty, error, and refresh status', () => {
    const refetch = vi.fn()
    const status = getServerTableStatus({
      error: null,
      isFetching: true,
      isLoading: false,
      itemCount: 0,
      refetch,
    })

    expect(status).toMatchObject({
      isEmpty: true,
      isError: false,
      isLoading: false,
      isRefreshing: true,
    })

    status.refresh()
    expect(refetch).toHaveBeenCalledOnce()
  })
})
