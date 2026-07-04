import { describe, expect, it } from 'vitest'
import type { Course } from '../types'
import {
  formatCourseDate,
  formatCoursePrice,
  getCourseStatusTone,
  getCourseTaxonomyCount,
  getCourses,
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
})
