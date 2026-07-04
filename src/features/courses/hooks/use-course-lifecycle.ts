import { apiQueryKeys, useServerMutation } from '@/lib/query'

type CourseLifecycleVariables = {
  id: string
}

const authoredCoursesKey = apiQueryKeys.request({
  method: 'get',
  path: '/courses/mine',
})

const catalogCoursesKey = apiQueryKeys.request({
  method: 'get',
  path: '/courses',
})

export function usePublishCourse() {
  return useServerMutation<
    '/courses/{id}/publish',
    'post',
    CourseLifecycleVariables
  >({
    invalidates: [authoredCoursesKey, catalogCoursesKey],
    request: ({ id }) => ({
      method: 'post',
      path: '/courses/{id}/publish',
      pathParams: { id },
    }),
  })
}

export function useUnpublishCourse() {
  return useServerMutation<
    '/courses/{id}/unpublish',
    'post',
    CourseLifecycleVariables
  >({
    invalidates: [authoredCoursesKey, catalogCoursesKey],
    request: ({ id }) => ({
      method: 'post',
      path: '/courses/{id}/unpublish',
      pathParams: { id },
    }),
  })
}

export function useArchiveCourse() {
  return useServerMutation<
    '/courses/{id}/archive',
    'post',
    CourseLifecycleVariables
  >({
    invalidates: [authoredCoursesKey, catalogCoursesKey],
    request: ({ id }) => ({
      method: 'post',
      path: '/courses/{id}/archive',
      pathParams: { id },
    }),
  })
}
