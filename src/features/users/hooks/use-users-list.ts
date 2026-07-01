import { useServerList } from '@/lib/query'
import type { UsersListQuery, UsersListItem } from '../types'
import { getUsersListItems, getUsersListMeta } from '../services/users-query'

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
