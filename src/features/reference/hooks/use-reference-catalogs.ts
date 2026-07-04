import type { UseQueryResult } from '@tanstack/react-query'
import type { ApiError, ApiQueryParams } from '@/lib/api'
import { useServerQuery } from '@/lib/query'
import { referenceQueryKeys } from '../services/reference-query'
import type { ReferenceCatalogId, ReferenceCatalogResult } from '../types'

type DisciplineScopedReferenceQuery = ApiQueryParams<
  '/reference/specializations',
  'get'
>

export type ReferenceCatalogQuery = UseQueryResult<
  ReferenceCatalogResult,
  ApiError
>

export function useReferenceCatalogs({
  disciplineId,
}: {
  disciplineId?: string
}): Record<ReferenceCatalogId, ReferenceCatalogQuery> {
  const scopedQuery = getDisciplineScopedReferenceQuery(disciplineId)
  const disciplines = useServerQuery({
    queryKey: referenceQueryKeys.catalog('disciplines'),
    request: {
      path: '/reference/disciplines',
      method: 'get',
    },
  })
  const specializations = useServerQuery({
    queryKey: referenceQueryKeys.catalog('specializations', disciplineId),
    request: {
      path: '/reference/specializations',
      method: 'get',
      query: scopedQuery,
    },
  })
  const genres = useServerQuery({
    queryKey: referenceQueryKeys.catalog('genres', disciplineId),
    request: {
      path: '/reference/genres',
      method: 'get',
      query: scopedQuery,
    },
  })
  const skills = useServerQuery({
    queryKey: referenceQueryKeys.catalog('skills', disciplineId),
    request: {
      path: '/reference/skills',
      method: 'get',
      query: scopedQuery,
    },
  })
  const proficiencyLevels = useServerQuery({
    queryKey: referenceQueryKeys.catalog('proficiency-levels'),
    request: {
      path: '/reference/proficiency-levels',
      method: 'get',
    },
  })

  return {
    disciplines,
    specializations,
    genres,
    skills,
    'proficiency-levels': proficiencyLevels,
  }
}

function getDisciplineScopedReferenceQuery(
  disciplineId: string | undefined
): DisciplineScopedReferenceQuery | undefined {
  return disciplineId ? { disciplineId } : undefined
}
