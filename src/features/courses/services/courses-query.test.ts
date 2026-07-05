import { describe, expect, it } from 'vitest'
import type { Course } from '../types'
import {
  createAttachmentsBody,
  createCaptionsBody,
  createFaqsBody,
  formatCourseDate,
  formatCourseDuration,
  formatCoursePrice,
  getCertificateStatusTone,
  getCourseStatusTone,
  getCourseTaxonomyCount,
  getCourses,
  normalizeCertificates,
  normalizeCourseFaqs,
  normalizeCourseLocalizations,
  normalizeCourseSections,
  normalizeLessonProgress,
  normalizeSectionLessons,
  parseLines,
  type Certificate,
  type CourseDetail,
  type CourseFaq,
  type CourseLesson,
  type CourseLocalization,
  type CourseSection,
  type Enrollment,
  type LessonProgress,
} from './courses-query'

const course = {
  defaultLanguage: 'en_US',
  description: 'Intro course',
  disciplineIds: ['discipline-1'],
  genreIds: ['genre-1'],
  id: 'course-1',
  instructorUserId: 'user-1',
  levelId: null,
  offeringId: null,
  priceAmount: null,
  priceCurrency: null,
  publishedAt: null,
  skillIds: ['skill-1'],
  slug: 'intro-course',
  specializationIds: [],
  status: 'DRAFT',
  thumbnailMediaId: null,
  title: 'Intro Course',
} satisfies Course

describe('courses-query', () => {
  it('normalizes course query results', () => {
    expect(getCourses(undefined)).toEqual([])
    expect(
      getCourses({ data: [course], headers: {}, nextCursor: null, status: 200 })
    ).toEqual([course])
  })

  it('formats price and published dates from backend values', () => {
    expect(formatCoursePrice(course)).toBe('Free')
    expect(
      formatCoursePrice({
        ...course,
        priceAmount: 1299,
        priceCurrency: 'USD',
      })
    ).toBe('$12.99')
    expect(formatCourseDate(null)).toBe('Not published')
    expect(formatCourseDate('2026-01-02T00:00:00.000Z')).toContain('2026')
  })

  it('maps generated statuses and taxonomy counts', () => {
    expect(getCourseStatusTone('DRAFT')).toBe('warn')
    expect(getCourseStatusTone('PUBLISHED')).toBe('ok')
    expect(getCourseStatusTone('ARCHIVED')).toBe('neutral')
    expect(getCourseTaxonomyCount(course)).toBe(3)
  })

  it('normalizes generated learning nested arrays', () => {
    const lesson = {
      attachments: [],
      captions: [],
      durationSeconds: 90,
      id: 'lesson-1',
      isPreview: true,
      position: 1,
      sectionId: 'section-1',
      textContent: null,
      title: 'Lesson',
      type: 'TEXT',
      videoMediaId: null,
    } as unknown as CourseLesson
    const section = {
      id: 'section-1',
      lessons: [lesson],
      position: 1,
      title: 'Section',
    } as unknown as CourseSection
    const localization = {
      courseId: 'course-1',
      description: null,
      languageCode: 'en_US',
      releaseState: 'DRAFT',
      title: 'Intro',
    } as CourseLocalization
    const faq = {
      answer: 'Answer',
      courseId: 'course-1',
      id: 'faq-1',
      position: 2,
      question: 'Question',
    } as CourseFaq
    const courseDetail = {
      ...course,
      audiences: [],
      faqs: [faq],
      localizations: [localization],
      outcomes: [],
      promoVideoMediaId: null,
      requirements: [],
      sections: [section],
    } as unknown as CourseDetail
    const lessonProgress = {
      lessonId: 'lesson-1',
      status: 'COMPLETED',
    } as LessonProgress
    const enrollment = {
      completedAt: null,
      completedLessonCount: 1,
      courseId: 'course-1',
      enrolledAt: '2026-01-01T00:00:00.000Z',
      id: 'enrollment-1',
      lastLessonId: 'lesson-1',
      learnerUserId: 'user-1',
      lessons: [lessonProgress],
      progressPercent: 100,
      source: 'DIRECT',
      status: 'ACTIVE',
    } as unknown as Enrollment

    expect(normalizeCourseSections(courseDetail)).toEqual([section])
    expect(normalizeSectionLessons(section)).toEqual([lesson])
    expect(normalizeCourseLocalizations(courseDetail)).toEqual([localization])
    expect(normalizeCourseFaqs(courseDetail)).toEqual([faq])
    expect(normalizeLessonProgress(enrollment)).toEqual([lessonProgress])
  })

  it('formats learning values and generated body workarounds', () => {
    const certificate = {
      courseId: 'course-1',
      courseTitle: 'Intro',
      id: 'certificate-1',
      issuedAt: '2026-01-01T00:00:00.000Z',
      serial: 'CERT-1',
      status: 'ISSUED',
      userId: 'user-1',
      verifyCode: 'verify-1',
    } satisfies Certificate

    expect(normalizeCertificates(undefined)).toEqual([])
    expect(normalizeCertificates([certificate])).toEqual([certificate])
    expect(getCertificateStatusTone('ISSUED')).toBe('ok')
    expect(getCertificateStatusTone('REVOKED')).toBe('err')
    expect(formatCourseDuration(90)).toBe('1m 30s')
    expect(formatCourseDuration(null)).toBe('No duration')
    expect(parseLines('one\n\n two ')).toEqual(['one', 'two'])
    expect(createFaqsBody([{ answer: 'A', question: 'Q' }])).toEqual({
      faqs: [{ answer: 'A', question: 'Q' }],
    })
    expect(createAttachmentsBody()).toEqual({ attachments: [] })
    expect(createCaptionsBody()).toEqual({ captions: [] })
  })
})
