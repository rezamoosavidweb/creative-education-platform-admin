import type { ApiResult } from '@/lib/api'
import type { components } from '@/lib/api/schema'

type PageMeta = components['schemas']['PageMetaDto']

type PageLike<Item> = {
  data?: Item[]
  meta?: PageMeta
}

type CursorLike<Item> = {
  data?: Item[]
  items?: Item[]
  nextCursor?: string | null
  total?: number
}

export type PageItem<Body> = Body extends { data?: Array<infer Item> }
  ? Item
  : Body extends { data: Array<infer Item> }
    ? Item
    : never

export type CursorItem<Body> = Body extends { data?: Array<infer Item> }
  ? Item
  : Body extends { items?: Array<infer Item> }
    ? Item
    : never

export type ServerListResult<Item, Raw> = {
  apiResult: ApiResult<Raw>
  hasNextPage: boolean
  hasPreviousPage: boolean
  items: Item[]
  page: number
  pageCount: number
  pageSize: number
  raw: Raw
  total: number
}

export type CursorListResult<Item, Raw> = {
  apiResult: ApiResult<Raw>
  hasNextPage: boolean
  items: Item[]
  nextCursor: string | null
  raw: Raw
  total: number
}

export function normalizePageResult<Item, Raw>({
  getItems,
  getMeta,
  result,
}: {
  getItems?: (raw: Raw) => Item[]
  getMeta?: (raw: Raw) => PageMeta | undefined
  result: ApiResult<Raw>
}): ServerListResult<Item, Raw> {
  const pageLike = result.data as PageLike<Item>
  const items = getItems?.(result.data) ?? pageLike.data ?? []
  const meta = getMeta?.(result.data) ?? pageLike.meta
  const pageSize = meta?.take ?? items.length
  const total = meta?.itemCount ?? items.length

  return {
    apiResult: result,
    hasNextPage: meta?.hasNextPage ?? false,
    hasPreviousPage: meta?.hasPreviousPage ?? false,
    items,
    page: meta?.page ?? 1,
    pageCount: meta?.pageCount ?? 1,
    pageSize,
    raw: result.data,
    total,
  }
}

export function normalizeCursorResult<Item, Raw>({
  getItems,
  getNextCursor,
  getTotal,
  result,
}: {
  getItems?: (raw: Raw) => Item[]
  getNextCursor?: (raw: Raw, result: ApiResult<Raw>) => string | null
  getTotal?: (raw: Raw) => number | undefined
  result: ApiResult<Raw>
}): CursorListResult<Item, Raw> {
  const cursorLike = result.data as CursorLike<Item>
  const items =
    getItems?.(result.data) ?? cursorLike.data ?? cursorLike.items ?? []
  const nextCursor =
    getNextCursor?.(result.data, result) ??
    result.nextCursor ??
    cursorLike.nextCursor ??
    null
  const total = getTotal?.(result.data) ?? cursorLike.total ?? items.length

  return {
    apiResult: result,
    hasNextPage: !!nextCursor,
    items,
    nextCursor,
    raw: result.data,
    total,
  }
}
