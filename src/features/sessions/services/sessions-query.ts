import type { ServerTableMeta } from '@/components/data-table'
import type { ActiveSessionsResponse, AdminSession } from '../types'

export function getActiveSessionItems(
  raw: ActiveSessionsResponse | undefined
): AdminSession[] {
  return raw ?? []
}

export function getActiveSessionsTableMeta(
  sessions: readonly AdminSession[]
): ServerTableMeta {
  return {
    hasNextPage: false,
    hasPreviousPage: false,
    nextCursor: null,
    pageCount: sessions.length > 0 ? 1 : 0,
    rowCount: sessions.length,
  }
}

export function getReliableCurrentSessionId(
  sessions: readonly AdminSession[]
): string | null {
  return sessions.length === 1 ? (sessions[0]?.id ?? null) : null
}

export function formatSessionDateTime(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}
