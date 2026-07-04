import { describe, expect, it } from 'vitest'
import {
  formatSearchLocation,
  formatSearchRating,
  getSearchHitTags,
  GLOBAL_SEARCH_ENTITY_TYPES,
  GLOBAL_SEARCH_SORTS,
  parseCsv,
  normalizeFacetBuckets,
  normalizeSearchHits,
} from './global-search-query'

describe('global-search-query', () => {
  const hit = {
    availableForHire: true,
    city: 'Tehran',
    country: 'IR',
    disciplineIds: ['d1'],
    entityId: 'entity-1',
    entityType: 'PROFILE' as const,
    eventType: null,
    genreIds: ['g1'],
    handle: 'artist',
    id: 'hit-1',
    kinds: ['teacher'],
    organizationType: null,
    rating: 4.5,
    region: 'Tehran',
    reviewCount: 8,
    score: 10,
    skillIds: ['skill-1'],
    specializationIds: [],
    subtitle: 'Instructor',
    title: 'Artist',
    verified: true,
  }

  it('uses generated search enums', () => {
    expect(GLOBAL_SEARCH_ENTITY_TYPES).toContain('PROFILE')
    expect(GLOBAL_SEARCH_SORTS).toContain('RELEVANCE')
  })

  it('formats hits and parses comma values', () => {
    expect(formatSearchLocation(hit)).toBe('Tehran, Tehran, IR')
    expect(formatSearchRating(hit)).toBe('4.5 (8)')
    expect(getSearchHitTags(hit)).toEqual(['teacher', 'd1', 'g1', 'skill-1'])
    expect(parseCsv('a, b,,')).toEqual(['a', 'b'])
    expect(parseCsv('')).toBeUndefined()
    expect(normalizeSearchHits(hit)).toEqual([hit])
    expect(normalizeFacetBuckets({ count: 2, value: 'PROFILE' })).toEqual([
      { count: 2, value: 'PROFILE' },
    ])
  })
})
