import type { AuthCapability } from '@/lib/auth/types'
import type { ServerTableQueryParams } from '@/components/data-table'
import type {
  UsersListItem,
  UsersListQuery,
  UsersListResponse,
  UsersOrder,
} from '../types'

export const USER_READ_CAPABILITY =
  'identity.user.read' satisfies AuthCapability

export const DEFAULT_USERS_ORDER = 'DESC' satisfies UsersOrder

export function getUsersListItems(raw: UsersListResponse): UsersListItem[] {
  return raw.data ?? []
}

export function getUsersListMeta(raw: UsersListResponse) {
  return raw.meta
}

export function toUsersListQuery(
  tableQuery: ServerTableQueryParams
): UsersListQuery {
  const query: UsersListQuery = {}
  const page = readPositiveNumber(tableQuery.page)
  const take = readPositiveNumber(tableQuery.take)
  const q = readText(tableQuery.q)
  const order = normalizeUsersOrder(tableQuery.order)

  if (page) query.page = page
  if (take) query.take = take
  if (q) query.q = q
  if (order) query.order = order

  return query
}

export function normalizeUsersOrder(value: unknown): UsersOrder | undefined {
  if (value === 'ASC' || value === 'DESC') {
    return value
  }

  return undefined
}

function readPositiveNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
    ? value
    : undefined
}

function readText(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined

  const trimmed = value.trim()
  return trimmed ? trimmed : undefined
}
