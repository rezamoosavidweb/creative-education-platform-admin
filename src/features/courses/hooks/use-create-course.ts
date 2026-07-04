import { apiQueryKeys, useServerMutation } from '@/lib/query'
import type { CreateCourseRequest } from '../types'

export function useCreateCourse() {
  return useServerMutation<'/courses', 'post', CreateCourseRequest>({
    invalidates: [
      apiQueryKeys.request({
        method: 'get',
        path: '/courses/mine',
      }),
    ],
    request: (variables) => ({
      body: variables,
      method: 'post',
      path: '/courses',
    }),
  })
}
