import type { ApiResult } from '@/lib/api'
import type { PillTone } from '@/components/status-pill'
import type { Course, CourseStatus, LanguageCode } from '../types'

export const LANGUAGE_OPTIONS: { label: string; value: LanguageCode }[] = [
  { label: 'English (US)', value: 'en_US' },
  { label: 'Russian', value: 'ru_RU' },
]

export function getCourses(result: ApiResult<Course[]> | undefined): Course[] {
  return result?.data ?? []
}

export function formatCoursePrice(course: Course): string {
  if (course.priceAmount == null || !course.priceCurrency) return 'Free'

  return new Intl.NumberFormat('en-US', {
    currency: course.priceCurrency,
    style: 'currency',
  }).format(course.priceAmount / 100)
}

export function formatCourseDate(value: string | null | undefined): string {
  if (!value) return 'Not published'

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  }).format(new Date(value))
}

export function getCourseStatusTone(status: CourseStatus): PillTone {
  switch (status) {
    case 'PUBLISHED':
      return 'ok'
    case 'ARCHIVED':
      return 'neutral'
    case 'DRAFT':
    default:
      return 'warn'
  }
}

export function getCourseTaxonomyCount(course: Course): number {
  return (
    course.disciplineIds.length +
    course.specializationIds.length +
    course.genreIds.length +
    course.skillIds.length
  )
}
