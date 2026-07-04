import { describe, expect, it } from 'vitest'
import type { ReferenceCatalogId, ReferenceItem } from '../types'
import {
  getReferenceItems,
  getReferenceStats,
  getReferenceTableMeta,
  normalizeDisciplineId,
  normalizeReferenceCatalog,
} from './reference-query'

const item: ReferenceItem = {
  id: '0f9beaaa-b8f7-4e4d-b245-5bb356757510',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
  slug: 'music',
  name: 'Music',
}

const emptyCatalogs: Record<ReferenceCatalogId, ReferenceItem[]> = {
  disciplines: [],
  specializations: [],
  genres: [],
  skills: [],
  'proficiency-levels': [],
}

describe('reference query helpers', () => {
  it('normalizes missing arrays', () => {
    expect(getReferenceItems(undefined)).toEqual([])
    expect(getReferenceItems([item])).toEqual([item])
  })

  it('normalizes catalog search values', () => {
    expect(normalizeReferenceCatalog('skills')).toBe('skills')
    expect(normalizeReferenceCatalog('unknown')).toBe('disciplines')
  })

  it('normalizes discipline ids', () => {
    expect(normalizeDisciplineId(' abc ')).toBe('abc')
    expect(normalizeDisciplineId('')).toBeUndefined()
    expect(normalizeDisciplineId(123)).toBeUndefined()
  })

  it('builds array table metadata', () => {
    expect(getReferenceTableMeta([item])).toMatchObject({
      pageCount: 1,
      rowCount: 1,
    })
    expect(getReferenceTableMeta([])).toMatchObject({
      pageCount: 0,
      rowCount: 0,
    })
  })

  it('marks scoped stats for discipline-scoped catalogs', () => {
    const stats = getReferenceStats(
      {
        ...emptyCatalogs,
        disciplines: [item],
        skills: [item],
      },
      true
    )

    expect(stats.find((stat) => stat.id === 'disciplines')?.foot).toBe(
      'Active creative disciplines.'
    )
    expect(stats.find((stat) => stat.id === 'skills')?.foot).toBe(
      'Scoped by discipline'
    )
  })
})
