import {
  SearchEntityType,
  SearchSort,
  type FacetBucketDto,
} from '@/lib/api/generated/model'
import type { GlobalSearchHit, GlobalSearchResult } from '../types'

export const GLOBAL_SEARCH_ENTITY_TYPES = Object.values(SearchEntityType)
export const GLOBAL_SEARCH_SORTS = Object.values(SearchSort)

export function formatSearchLocation(hit: GlobalSearchHit): string {
  return [hit.city, hit.region, hit.country].filter(Boolean).join(', ') || 'n/a'
}

export function formatSearchRating(hit: GlobalSearchHit): string {
  return `${hit.rating.toFixed(1)} (${hit.reviewCount})`
}

export function getSearchHitTags(hit: GlobalSearchHit): string[] {
  return [
    ...hit.kinds,
    ...hit.disciplineIds,
    ...hit.specializationIds,
    ...hit.genreIds,
    ...hit.skillIds,
  ]
}

export function parseCsv(value: string): string[] | undefined {
  const values = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  return values.length ? values : undefined
}

export function normalizeSearchHits(
  hits: GlobalSearchResult['hits'] | GlobalSearchHit[]
): GlobalSearchHit[] {
  return Array.isArray(hits) ? hits : hits ? [hits] : []
}

export function normalizeFacetBuckets(
  buckets: FacetBucketDto | FacetBucketDto[]
): FacetBucketDto[] {
  return Array.isArray(buckets) ? buckets : buckets ? [buckets] : []
}
