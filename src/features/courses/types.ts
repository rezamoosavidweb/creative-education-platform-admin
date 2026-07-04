import type { ApiRequestBody, ApiResponseBody } from '@/lib/api'
import type { components } from '@/lib/api/schema'

export type Course = ApiResponseBody<'/courses', 'get'>[number]
export type CourseDetail = ApiResponseBody<'/courses/{id}', 'get'>
export type CourseStatus = components['schemas']['CourseStatus']
export type LanguageCode = components['schemas']['LanguageCode']
export type CreateCourseRequest = ApiRequestBody<'/courses', 'post'>
