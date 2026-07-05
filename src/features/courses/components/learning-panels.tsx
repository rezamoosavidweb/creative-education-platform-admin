import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, Play, Save } from 'lucide-react'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api'
import { useApiForm } from '@/lib/forms'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ApiEmpty, ApiQueryState } from '@/components/api'
import { StatusPill } from '@/components/status-pill'
import {
  useCertificates,
  useCompleteLesson,
  useCourseProgress,
  useEnrollInCourse,
  useGetLessonPlayback,
  useSaveLessonPosition,
  useVerifyCertificate,
} from '../hooks/use-learning-workflows'
import {
  formatCourseDate,
  getCertificateStatusTone,
  normalizeCertificates,
  normalizeLessonProgress,
  type Certificate,
} from '../services/courses-query'
import type { Course } from '../types'

const progressSchema = z.object({
  courseId: z.string().uuid(),
  lessonId: z.string().uuid().optional().or(z.literal('')),
  lastPositionSeconds: z.coerce
    .number()
    .int()
    .min(0)
    .optional()
    .or(z.literal('')),
})

const verifySchema = z.object({
  code: z.string().trim().min(1),
})

export function LearningProgressPanel({ courses }: { courses: Course[] }) {
  const [courseId, setCourseId] = useState(courses[0]?.id ?? '')
  const progressQuery = useCourseProgress(courseId || null, Boolean(courseId))
  const enrollMutation = useEnrollInCourse()
  const completeMutation = useCompleteLesson()
  const savePositionMutation = useSaveLessonPosition()
  const playbackMutation = useGetLessonPlayback()
  const progress = progressQuery.data
  const lessonProgress = normalizeLessonProgress(progress)
  const { form, handleApiSubmit } = useApiForm<z.input<typeof progressSchema>>({
    defaultValues: {
      courseId,
      lastPositionSeconds: '',
      lessonId: '',
    },
    resolver: zodResolver(progressSchema),
    values: {
      courseId,
      lastPositionSeconds: '',
      lessonId: '',
    },
  })

  async function enroll() {
    if (!courseId) return
    const promise = enrollMutation.mutateAsync(courseId)
    toast.promise(promise, {
      loading: 'Enrolling in course...',
      success: 'Enrollment created.',
      error: getApiErrorMessage,
    })
    await promise
  }

  const onSubmit = handleApiSubmit(async (values) => {
    if (!values.lessonId) return

    if (typeof values.lastPositionSeconds === 'number') {
      const promise = savePositionMutation.mutateAsync({
        body: { lastPositionSeconds: values.lastPositionSeconds },
        lessonId: values.lessonId,
      })
      toast.promise(promise, {
        loading: 'Saving position...',
        success: 'Position saved.',
        error: getApiErrorMessage,
      })
      await promise
      return
    }

    const promise = completeMutation.mutateAsync(values.lessonId)
    toast.promise(promise, {
      loading: 'Completing lesson...',
      success: 'Lesson completed.',
      error: getApiErrorMessage,
    })
    await promise
  })

  async function getPlayback() {
    const lessonId = form.getValues('lessonId')
    if (!lessonId) return
    const promise = playbackMutation.mutateAsync(lessonId)
    toast.promise(promise, {
      loading: 'Fetching playback URL...',
      success: (result) => result.url,
      error: getApiErrorMessage,
    })
    await promise
  }

  if (courses.length === 0) {
    return (
      <ApiEmpty
        title='No catalog courses'
        description='The backend returned no published courses to enroll in.'
      />
    )
  }

  return (
    <div className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]'>
      <Card>
        <CardHeader>
          <CardTitle>Learning progress</CardTitle>
          <CardDescription>
            Enroll in a published course and update learner progress.
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <div className='grid gap-2'>
            <label className='text-sm font-medium' htmlFor='learning-course'>
              Course
            </label>
            <select
              id='learning-course'
              className='h-9 rounded-md border bg-background px-3 text-sm'
              value={courseId}
              onChange={(event) => setCourseId(event.target.value)}
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
          <Button type='button' onClick={() => void enroll()}>
            Enroll
          </Button>
          <ApiQueryState
            emptyTitle='No progress'
            emptyDescription='Enroll first, or select a course where progress exists.'
            error={progressQuery.error}
            hasData={Boolean(progress)}
            isError={progressQuery.isError}
            isLoading={progressQuery.isLoading}
            loadingLabel='Loading progress...'
            onRetry={() => void progressQuery.refetch()}
          >
            {progress && (
              <div className='grid gap-2'>
                <div className='rounded-md border p-3'>
                  <div className='text-2xl font-semibold'>
                    {progress.progressPercent}%
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    {progress.completedLessonCount} lessons completed
                  </div>
                </div>
                {lessonProgress.map((lesson) => (
                  <div
                    key={lesson.lessonId}
                    className='flex items-center justify-between gap-3 rounded-md border p-3 text-sm'
                  >
                    <span className='break-all'>{lesson.lessonId}</span>
                    <StatusPill
                      tone={lesson.status === 'COMPLETED' ? 'ok' : 'warn'}
                    >
                      {lesson.status}
                    </StatusPill>
                  </div>
                ))}
              </div>
            )}
          </ApiQueryState>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lesson tools</CardTitle>
          <CardDescription>
            Complete a lesson, save playback position, or request playback.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={onSubmit} className='grid gap-3'>
              <FormField
                control={form.control}
                name='lessonId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson ID</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='lastPositionSeconds'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position seconds</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={0}
                        value={field.value as number | string}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit'>
                <Save className='size-4' />
                Save position or complete
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => void getPlayback()}
              >
                <Play className='size-4' />
                Get playback
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export function CertificatesPanel() {
  const [verifyCode, setVerifyCode] = useState('')
  const certificatesQuery = useCertificates()
  const certificates = normalizeCertificates(certificatesQuery.data)
  const { form, handleApiSubmit } = useApiForm<z.input<typeof verifySchema>>({
    defaultValues: { code: '' },
    resolver: zodResolver(verifySchema),
  })
  const verifyQuery = useVerifyCertificate(verifyCode)
  const onSubmit = handleApiSubmit(async (values) => setVerifyCode(values.code))

  return (
    <div className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]'>
      <Card>
        <CardHeader>
          <CardTitle>My certificates</CardTitle>
          <CardDescription>
            Course completion certificates for the caller.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApiQueryState
            emptyTitle='No certificates'
            emptyDescription='The backend returned no certificates for this account.'
            error={certificatesQuery.error}
            hasData={certificates.length > 0}
            isError={certificatesQuery.isError}
            isLoading={certificatesQuery.isLoading}
            loadingLabel='Loading certificates...'
            onRetry={() => void certificatesQuery.refetch()}
          >
            <CertificateList items={certificates} />
          </ApiQueryState>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verify certificate</CardTitle>
          <CardDescription>
            Look up a public certificate verification code.
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <Form {...form}>
            <form onSubmit={onSubmit} className='grid gap-3'>
              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verify code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit'>
                <Link className='size-4' />
                Verify
              </Button>
            </form>
          </Form>
          {verifyCode && (
            <ApiQueryState
              emptyTitle='Certificate not found'
              error={verifyQuery.error}
              hasData={Boolean(verifyQuery.data)}
              isError={verifyQuery.isError}
              isLoading={verifyQuery.isLoading}
              loadingLabel='Verifying certificate...'
              onRetry={() => void verifyQuery.refetch()}
            >
              {verifyQuery.data && (
                <CertificateList items={[verifyQuery.data]} />
              )}
            </ApiQueryState>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function CertificateList({ items }: { items: Certificate[] }) {
  return (
    <div className='grid gap-3'>
      {items.map((certificate) => (
        <div key={certificate.id} className='rounded-md border p-3'>
          <div className='flex items-start justify-between gap-3'>
            <div className='min-w-0'>
              <div className='font-medium'>
                {certificate.courseTitle ?? certificate.courseId}
              </div>
              <div className='text-xs text-muted-foreground'>
                {certificate.serial} - issued{' '}
                {formatCourseDate(certificate.issuedAt)}
              </div>
            </div>
            <StatusPill tone={getCertificateStatusTone(certificate.status)}>
              {certificate.status}
            </StatusPill>
          </div>
          <div className='mt-2 text-xs break-all text-muted-foreground'>
            Verify code: {certificate.verifyCode}
          </div>
        </div>
      ))}
    </div>
  )
}
