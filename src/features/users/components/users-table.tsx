import { type NavigateFn } from '@/hooks/use-table-url-state'
import {
  getPageServerTableMeta,
  getServerTableStatus,
  ServerDataTable,
  useServerTableState,
} from '@/components/data-table'
import { useUsersList } from '../hooks/use-users-list'
import { toUsersListQuery } from '../services/users-query'
import { usersColumns } from './users-columns'

type UsersTableProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function UsersTable({ search, navigate }: UsersTableProps) {
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
      columns={usersColumns}
      data={rows}
      emptyDescription='No users match the current search.'
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
