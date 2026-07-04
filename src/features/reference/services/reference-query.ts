import { createQueryKey } from '@/lib/query'
import type { ServerTableMeta } from '@/components/data-table'
import type { ReferenceCatalogId, ReferenceItem } from '../types'

export type ReferenceCatalogConfig = {
  id: ReferenceCatalogId
  label: string
  description: string
  supportsDisciplineFilter: boolean
}

export type ReferenceStat = {
  id: ReferenceCatalogId
  label: string
  value: string
  foot: string
}

export const referenceCatalogConfigs: ReferenceCatalogConfig[] = [
  {
    id: 'disciplines',
    label: 'Disciplines',
    description: 'Active creative disciplines.',
    supportsDisciplineFilter: false,
  },
  {
    id: 'specializations',
    label: 'Specializations',
    description: 'Active specializations, optionally scoped by discipline.',
    supportsDisciplineFilter: true,
  },
  {
    id: 'genres',
    label: 'Genres',
    description: 'Active genres, optionally scoped by discipline.',
    supportsDisciplineFilter: true,
  },
  {
    id: 'skills',
    label: 'Skills',
    description: 'Active skills, optionally scoped by discipline.',
    supportsDisciplineFilter: true,
  },
  {
    id: 'proficiency-levels',
    label: 'Proficiency Levels',
    description: 'Ordered proficiency levels.',
    supportsDisciplineFilter: false,
  },
]

export const referenceQueryKeys = {
  catalog: (catalog: ReferenceCatalogId, disciplineId?: string) =>
    createQueryKey('reference', catalog, { disciplineId }),
}

export function getReferenceItems(
  raw: ReferenceItem[] | null | undefined
): ReferenceItem[] {
  return raw ?? []
}

export function getReferenceTableMeta(
  items: readonly ReferenceItem[]
): ServerTableMeta {
  return {
    hasNextPage: false,
    hasPreviousPage: false,
    nextCursor: null,
    pageCount: items.length > 0 ? 1 : 0,
    rowCount: items.length,
  }
}

export function getReferenceStats(
  itemsByCatalog: Record<ReferenceCatalogId, readonly ReferenceItem[]>,
  scopedByDiscipline: boolean
): ReferenceStat[] {
  return referenceCatalogConfigs.map((config) => ({
    id: config.id,
    label: config.label,
    value: itemsByCatalog[config.id].length.toLocaleString(),
    foot:
      scopedByDiscipline && config.supportsDisciplineFilter
        ? 'Scoped by discipline'
        : config.description,
  }))
}

export function getReferenceCatalogConfig(
  catalog: ReferenceCatalogId
): ReferenceCatalogConfig {
  return (
    referenceCatalogConfigs.find((config) => config.id === catalog) ??
    referenceCatalogConfigs[0]
  )
}

export function normalizeReferenceCatalog(value: unknown): ReferenceCatalogId {
  return referenceCatalogConfigs.some((config) => config.id === value)
    ? (value as ReferenceCatalogId)
    : 'disciplines'
}

export function normalizeDisciplineId(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : undefined
}

export function formatReferenceDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}
