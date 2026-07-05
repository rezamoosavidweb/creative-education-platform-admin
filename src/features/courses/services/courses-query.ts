import type { ApiResult } from '@/lib/api'
import type {
  CertificateDto,
  CourseDetailDto,
  CourseFaqDto,
  CourseLocalizationDto,
  EnrollmentDto,
  FaqInputDto,
  LessonDto,
  LessonProgressDto,
  SectionDto,
  SetAttachmentsDto,
  SetCaptionsDto,
  SetFaqsDto,
} from '@/lib/api/generated/model'
import type { PillTone } from '@/components/status-pill'
import type { Course, CourseStatus, LanguageCode } from '../types'

export type CourseDetail = CourseDetailDto
export type CourseSection = SectionDto
export type CourseLesson = LessonDto
export type CourseLocalization = CourseLocalizationDto
export type CourseFaq = CourseFaqDto
export type Enrollment = EnrollmentDto
export type LessonProgress = LessonProgressDto
export type Certificate = CertificateDto

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

export function normalizeCourseSections(
  course: CourseDetail | undefined
): CourseSection[] {
  return normalizeArray(course?.sections)
}

export function normalizeSectionLessons(
  section: CourseSection
): CourseLesson[] {
  return normalizeArray(section.lessons)
}

export function normalizeCourseLocalizations(
  course: CourseDetail | undefined
): CourseLocalization[] {
  return normalizeArray(course?.localizations)
}

export function normalizeCourseFaqs(
  course: CourseDetail | undefined
): CourseFaq[] {
  return normalizeArray(course?.faqs).sort(
    (left, right) => left.position - right.position
  )
}

export function normalizeLessonProgress(
  enrollment: Enrollment | undefined
): LessonProgress[] {
  return normalizeArray(enrollment?.lessons)
}

export function getCertificates(
  result: ApiResult<Certificate[]> | undefined
): Certificate[] {
  return result?.data ?? []
}

export function normalizeCertificates(
  certificates: Certificate[] | undefined
): Certificate[] {
  return certificates ?? []
}

export function getCertificateStatusTone(
  status: Certificate['status']
): PillTone {
  switch (status) {
    case 'ISSUED':
      return 'ok'
    case 'REVOKED':
      return 'err'
    default:
      return 'neutral'
  }
}

export function formatCourseDuration(
  seconds: number | null | undefined
): string {
  if (!seconds) return 'No duration'
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

export function parseLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export function createFaqsBody(faqs: FaqInputDto[]): SetFaqsDto {
  return { faqs } as unknown as SetFaqsDto
}

export function createAttachmentsBody(): SetAttachmentsDto {
  return { attachments: [] } as unknown as SetAttachmentsDto
}

export function createCaptionsBody(): SetCaptionsDto {
  return { captions: [] } as unknown as SetCaptionsDto
}

function normalizeArray<T>(value: T | T[] | null | undefined): T[] {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}
