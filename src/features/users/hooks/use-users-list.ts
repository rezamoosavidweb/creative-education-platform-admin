import { useServerList } from '@/lib/query'
import { getUsersListItems, getUsersListMeta } from '../services/users-query'
import type { UsersListQuery, UsersListItem } from '../types'

export function useUsersList(query: UsersListQuery) {
  return useServerList<'/users', 'get', UsersListItem>({
    getItems: getUsersListItems,
    getMeta: getUsersListMeta,
    request: {
      method: 'get',
      path: '/users',
      query,
    },
  })
}
