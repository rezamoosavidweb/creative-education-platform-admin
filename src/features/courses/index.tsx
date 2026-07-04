import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useServerQuery } from '@/lib/query'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ApiEmpty, ApiError, ApiLoading } from '@/components/api'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { CoursesTable } from './components/courses-table'
import { CreateCourseDialog } from './components/create-course-dialog'
import {
  useArchiveCourse,
  usePublishCourse,
  useUnpublishCourse,
} from './hooks/use-course-lifecycle'
import { getCourses } from './services/courses-query'
import type { Course } from './types'

export function Courses() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const authoredQuery = useServerQuery({
    request: {
      method: 'get',
      path: '/courses/mine',
    },
  })
  const catalogQuery = useServerQuery({
    request: {
      method: 'get',
      path: '/courses',
    },
  })
  const publishMutation = usePublishCourse()
  const unpublishMutation = useUnpublishCourse()
  const archiveMutation = useArchiveCourse()
  const authoredCourses = getCourses(authoredQuery.data)
  const catalogCourses = getCourses(catalogQuery.data)

  const publishCourse = async (course: Course) => {
    await publishMutation.mutateAsync({ id: course.id })
  }

  const unpublishCourse = async (course: Course) => {
    await unpublishMutation.mutateAsync({ id: course.id })
  }

  const archiveCourse = async (course: Course) => {
    await archiveMutation.mutateAsync({ id: course.id })
  }

  return (
    <>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Courses</h2>
            <p className='text-muted-foreground'>
              Manage your authored courses and review the published catalog.
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className='size-4' />
            New course
          </Button>
        </div>

        <Tabs defaultValue='authored' className='w-full'>
          <TabsList>
            <TabsTrigger value='authored'>Authored</TabsTrigger>
            <TabsTrigger value='catalog'>Catalog</TabsTrigger>
          </TabsList>

          <TabsContent value='authored' className='mt-4'>
            {authoredQuery.isLoading && (
              <ApiLoading label='Loading authored courses...' />
            )}
            {authoredQuery.isError && (
              <ApiError
                error={authoredQuery.error}
                onRetry={() => void authoredQuery.refetch()}
              />
            )}
            {!authoredQuery.isLoading &&
              !authoredQuery.isError &&
              authoredCourses.length === 0 && (
                <ApiEmpty
                  title='No authored courses'
                  description='The backend returned no authored courses for this account.'
                />
              )}
            {!authoredQuery.isLoading &&
              !authoredQuery.isError &&
              authoredCourses.length > 0 && (
                <CoursesTable
                  courses={authoredCourses}
                  onArchive={archiveCourse}
                  onPublish={publishCourse}
                  onUnpublish={unpublishCourse}
                  showActions
                />
              )}
          </TabsContent>

          <TabsContent value='catalog' className='mt-4'>
            {catalogQuery.isLoading && (
              <ApiLoading label='Loading published catalog...' />
            )}
            {catalogQuery.isError && (
              <ApiError
                error={catalogQuery.error}
                onRetry={() => void catalogQuery.refetch()}
              />
            )}
            {!catalogQuery.isLoading &&
              !catalogQuery.isError &&
              catalogCourses.length === 0 && (
                <ApiEmpty
                  title='No published courses'
                  description='The backend public catalog returned no published courses.'
                />
              )}
            {!catalogQuery.isLoading &&
              !catalogQuery.isError &&
              catalogCourses.length > 0 && (
                <CoursesTable courses={catalogCourses} />
              )}
          </TabsContent>
        </Tabs>
      </Main>

      <CreateCourseDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </>
  )
}
