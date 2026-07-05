import { Archive, Eye, EyeOff, Send } from 'lucide-react'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusPill } from '@/components/status-pill'
import {
  formatCourseDate,
  formatCoursePrice,
  getCourseStatusTone,
  getCourseTaxonomyCount,
} from '../services/courses-query'
import type { Course } from '../types'

type CoursesTableProps = {
  courses: Course[]
  onArchive?: (course: Course) => Promise<void>
  onBuild?: (course: Course) => void
  onPublish?: (course: Course) => Promise<void>
  onUnpublish?: (course: Course) => Promise<void>
  showActions?: boolean
}

export function CoursesTable({
  courses,
  onArchive,
  onBuild,
  onPublish,
  onUnpublish,
  showActions = false,
}: CoursesTableProps) {
  const runAction = async (
    label: string,
    course: Course,
    action: ((course: Course) => Promise<void>) | undefined
  ) => {
    if (!action) return

    const promise = action(course)
    toast.promise(promise, {
      loading: `${label} course...`,
      success: `Course ${label.toLowerCase()}ed.`,
      error: getApiErrorMessage,
    })
    await promise
  }

  return (
    <div className='rounded-md border bg-[var(--sur)]'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Taxonomy</TableHead>
            <TableHead>Published</TableHead>
            {showActions && <TableHead className='text-end'>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell className='min-w-[260px] whitespace-normal'>
                <div className='font-medium'>{course.title}</div>
                <div className='text-xs text-muted-foreground'>
                  /{course.slug} · {course.defaultLanguage}
                </div>
              </TableCell>
              <TableCell>
                <StatusPill tone={getCourseStatusTone(course.status)}>
                  {course.status}
                </StatusPill>
              </TableCell>
              <TableCell>{formatCoursePrice(course)}</TableCell>
              <TableCell>{getCourseTaxonomyCount(course)} linked</TableCell>
              <TableCell>{formatCourseDate(course.publishedAt)}</TableCell>
              {showActions && (
                <TableCell>
                  <div className='flex justify-end gap-2'>
                    {onBuild && (
                      <Button
                        size='icon'
                        variant='ghost'
                        aria-label={`Build ${course.title}`}
                        onClick={() => onBuild(course)}
                      >
                        <Eye className='size-4' />
                      </Button>
                    )}
                    {course.status !== 'PUBLISHED' && (
                      <Button
                        size='icon'
                        variant='ghost'
                        aria-label={`Publish ${course.title}`}
                        onClick={() =>
                          void runAction('Publish', course, onPublish)
                        }
                      >
                        <Send className='size-4' />
                      </Button>
                    )}
                    {course.status === 'PUBLISHED' && (
                      <Button
                        size='icon'
                        variant='ghost'
                        aria-label={`Unpublish ${course.title}`}
                        onClick={() =>
                          void runAction('Unpublish', course, onUnpublish)
                        }
                      >
                        <EyeOff className='size-4' />
                      </Button>
                    )}
                    {course.status !== 'ARCHIVED' && (
                      <Button
                        size='icon'
                        variant='ghost'
                        aria-label={`Archive ${course.title}`}
                        onClick={() =>
                          void runAction('Archive', course, onArchive)
                        }
                      >
                        <Archive className='size-4' />
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
