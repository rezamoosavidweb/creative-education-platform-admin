import type { ApiResult } from '@/lib/api'
import type { components } from '@/lib/api/schema'

export const referenceCatalogIds = [
  'disciplines',
  'specializations',
  'genres',
  'skills',
  'proficiency-levels',
] as const

export type ReferenceCatalogId = (typeof referenceCatalogIds)[number]

export type ReferenceItem = components['schemas']['ReferenceDto']

export type ReferenceCatalogResult = ApiResult<ReferenceItem[]>
