import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  certificateControllerListMine,
  certificateControllerVerify,
  courseControllerAddLesson,
  courseControllerAddSection,
  courseControllerGetCourse,
  courseControllerRemoveLesson,
  courseControllerRemoveSection,
  courseControllerSetAttachments,
  courseControllerSetCaptions,
  courseControllerSetFaqs,
  courseControllerUpdateCourse,
  courseControllerUpdateLesson,
  courseControllerUpdateSection,
  courseControllerUpsertLocalization,
  enrollmentControllerCompleteLesson,
  enrollmentControllerEnroll,
  enrollmentControllerGetPlayback,
  enrollmentControllerGetProgress,
  enrollmentControllerSavePosition,
} from '@/lib/api/generated/endpoints/learning/learning'
import type {
  CreateLessonDto,
  CreateSectionDto,
  SaveLessonPositionDto,
  SetAttachmentsDto,
  SetCaptionsDto,
  SetFaqsDto,
  UpdateCourseDto,
  UpdateLessonDto,
  UpdateSectionDto,
  UpsertLocalizationDto,
} from '@/lib/api/generated/model'

export const learningQueryKeys = {
  all: ['learning'] as const,
  certificates: () => [...learningQueryKeys.all, 'certificates'] as const,
  course: (id: string | null) =>
    [...learningQueryKeys.all, 'course', id] as const,
  progress: (id: string | null) =>
    [...learningQueryKeys.all, 'progress', id] as const,
  verify: (code: string) => [...learningQueryKeys.all, 'verify', code] as const,
}

export function useCourseDetail(id: string | null) {
  return useQuery({
    enabled: Boolean(id),
    queryFn: ({ signal }) =>
      courseControllerGetCourse(id ?? '', undefined, signal),
    queryKey: learningQueryKeys.course(id),
  })
}

export function useCourseProgress(id: string | null, enabled: boolean) {
  return useQuery({
    enabled: Boolean(id) && enabled,
    queryFn: ({ signal }) =>
      enrollmentControllerGetProgress(id ?? '', undefined, signal),
    queryKey: learningQueryKeys.progress(id),
    retry: false,
  })
}

export function useCertificates() {
  return useQuery({
    queryFn: ({ signal }) => certificateControllerListMine(undefined, signal),
    queryKey: learningQueryKeys.certificates(),
  })
}

export function useVerifyCertificate(code: string) {
  return useQuery({
    enabled: code.trim().length > 0,
    queryFn: ({ signal }) =>
      certificateControllerVerify(code.trim(), undefined, signal),
    queryKey: learningQueryKeys.verify(code.trim()),
    retry: false,
  })
}

export function useUpdateCourseDetail() {
  return useCourseMutation(
    ({ body, id }: { body: UpdateCourseDto; id: string }) =>
      courseControllerUpdateCourse(id, body)
  )
}

export function useUpsertCourseLocalization() {
  return useCourseMutation(
    ({ body, id }: { body: UpsertLocalizationDto; id: string }) =>
      courseControllerUpsertLocalization(id, body)
  )
}

export function useSetCourseFaqs() {
  return useCourseMutation(({ body, id }: { body: SetFaqsDto; id: string }) =>
    courseControllerSetFaqs(id, body)
  )
}

export function useAddCourseSection() {
  return useCourseMutation(
    ({ body, id }: { body: CreateSectionDto; id: string }) =>
      courseControllerAddSection(id, body)
  )
}

export function useUpdateCourseSection() {
  return useCourseMutation(
    ({ body, id }: { body: UpdateSectionDto; id: string }) =>
      courseControllerUpdateSection(id, body)
  )
}

export function useRemoveCourseSection() {
  return useCourseMutation((id: string) => courseControllerRemoveSection(id))
}

export function useAddCourseLesson() {
  return useCourseMutation(
    ({ body, sectionId }: { body: CreateLessonDto; sectionId: string }) =>
      courseControllerAddLesson(sectionId, body)
  )
}

export function useUpdateCourseLesson() {
  return useCourseMutation(
    ({ body, id }: { body: UpdateLessonDto; id: string }) =>
      courseControllerUpdateLesson(id, body)
  )
}

export function useRemoveCourseLesson() {
  return useCourseMutation((id: string) => courseControllerRemoveLesson(id))
}

export function useSetLessonAttachments() {
  return useCourseMutation(
    ({ body, id }: { body: SetAttachmentsDto; id: string }) =>
      courseControllerSetAttachments(id, body)
  )
}

export function useSetLessonCaptions() {
  return useCourseMutation(
    ({ body, id }: { body: SetCaptionsDto; id: string }) =>
      courseControllerSetCaptions(id, body)
  )
}

export function useEnrollInCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => enrollmentControllerEnroll(id),
    onSuccess: async (_data, id) => {
      await queryClient.invalidateQueries({
        queryKey: learningQueryKeys.progress(id),
      })
    },
  })
}

export function useCompleteLesson() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (lessonId: string) =>
      enrollmentControllerCompleteLesson(lessonId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: learningQueryKeys.all })
    },
  })
}

export function useSaveLessonPosition() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      body,
      lessonId,
    }: {
      body: SaveLessonPositionDto
      lessonId: string
    }) => enrollmentControllerSavePosition(lessonId, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: learningQueryKeys.all })
    },
  })
}

export function useGetLessonPlayback() {
  return useMutation({
    mutationFn: (lessonId: string) => enrollmentControllerGetPlayback(lessonId),
  })
}

function useCourseMutation<TVariables, TResult>(
  mutationFn: (variables: TVariables) => Promise<TResult>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: learningQueryKeys.all })
      await queryClient.invalidateQueries({ queryKey: ['GET'] })
    },
  })
}
