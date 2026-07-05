import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, Save, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api'
import { useApiForm } from '@/lib/forms'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { ApiEmpty, ApiQueryState } from '@/components/api'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { SelectDropdown } from '@/components/select-dropdown'
import {
  useAddCourseLesson,
  useAddCourseSection,
  useCourseDetail,
  useRemoveCourseLesson,
  useRemoveCourseSection,
  useSetCourseFaqs,
  useSetLessonAttachments,
  useSetLessonCaptions,
  useUpdateCourseDetail,
  useUpdateCourseLesson,
  useUpsertCourseLocalization,
} from '../hooks/use-learning-workflows'
import {
  createAttachmentsBody,
  createCaptionsBody,
  createFaqsBody,
  formatCourseDuration,
  LANGUAGE_OPTIONS,
  normalizeCourseFaqs,
  normalizeCourseLocalizations,
  normalizeCourseSections,
  normalizeSectionLessons,
  parseLines,
  type CourseDetail,
  type CourseLesson,
  type CourseSection,
} from '../services/courses-query'
import type { Course } from '../types'

const metadataSchema = z.object({
  audiences: z.string(),
  description: z.string().trim().max(5000).optional(),
  outcomes: z.string(),
  priceAmount: z.coerce.number().int().min(1).optional().or(z.literal('')),
  priceCurrency: z.string().trim().length(3).optional().or(z.literal('')),
  requirements: z.string(),
  title: z.string().trim().min(2).max(160),
})

const localizationSchema = z.object({
  description: z.string().trim().max(5000).optional(),
  languageCode: z.enum(['en_US', 'ru_RU']),
  releaseState: z.enum(['DRAFT', 'SCHEDULED', 'RELEASED']),
  title: z.string().trim().min(2).max(160),
})

const sectionSchema = z.object({
  position: z.coerce.number().int().min(0).optional().or(z.literal('')),
  title: z.string().trim().min(1).max(160),
})

const lessonSchema = z.object({
  durationSeconds: z.coerce.number().int().min(0).optional().or(z.literal('')),
  isPreview: z.boolean(),
  position: z.coerce.number().int().min(0).optional().or(z.literal('')),
  textContent: z.string().trim().max(20000).optional(),
  title: z.string().trim().min(1).max(160),
  type: z.enum(['VIDEO', 'TEXT', 'DOWNLOAD']),
  videoMediaId: z.string().uuid().optional().or(z.literal('')),
})

const jsonListSchema = z.object({
  value: z.string().superRefine((value, context) => {
    try {
      const parsed = JSON.parse(value) as unknown
      if (!Array.isArray(parsed)) {
        context.addIssue({
          code: 'custom',
          message: 'Enter a JSON array of FAQ objects.',
        })
        return
      }
      parsed.forEach((item, index) => {
        if (
          typeof item !== 'object' ||
          item == null ||
          !('question' in item) ||
          !('answer' in item)
        ) {
          context.addIssue({
            code: 'custom',
            message: `FAQ ${index + 1} needs question and answer fields.`,
          })
        }
      })
    } catch {
      context.addIssue({
        code: 'custom',
        message: 'Enter valid JSON.',
      })
    }
  }),
})

type CourseBuilderDialogProps = {
  course: Course | null
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function CourseBuilderDialog({
  course,
  onOpenChange,
  open,
}: CourseBuilderDialogProps) {
  const detailQuery = useCourseDetail(open ? (course?.id ?? null) : null)
  const detail = detailQuery.data
  const sections = normalizeCourseSections(detail)
  const localizations = normalizeCourseLocalizations(detail)
  const faqs = normalizeCourseFaqs(detail)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-5xl'>
        <DialogHeader>
          <DialogTitle>Course builder</DialogTitle>
          <DialogDescription>
            Manage backend course metadata, localization, FAQs, sections, and
            lessons for the selected authored course.
          </DialogDescription>
        </DialogHeader>

        <ApiQueryState
          emptyTitle='Course unavailable'
          emptyDescription='The backend did not return course details.'
          error={detailQuery.error}
          hasData={Boolean(detail)}
          isError={detailQuery.isError}
          isLoading={detailQuery.isLoading}
          loadingLabel='Loading course...'
          onRetry={() => void detailQuery.refetch()}
        >
          {detail && (
            <Tabs defaultValue='metadata' className='grid gap-4'>
              <TabsList className='h-auto flex-wrap justify-start'>
                <TabsTrigger value='metadata'>Metadata</TabsTrigger>
                <TabsTrigger value='localization'>Localization</TabsTrigger>
                <TabsTrigger value='faqs'>FAQs</TabsTrigger>
                <TabsTrigger value='structure'>Structure</TabsTrigger>
              </TabsList>

              <TabsContent value='metadata'>
                <CourseMetadataForm course={detail} />
              </TabsContent>
              <TabsContent value='localization'>
                <CourseLocalizationForm course={detail} items={localizations} />
              </TabsContent>
              <TabsContent value='faqs'>
                <CourseFaqForm course={detail} items={faqs} />
              </TabsContent>
              <TabsContent value='structure'>
                <CourseStructureEditor course={detail} sections={sections} />
              </TabsContent>
            </Tabs>
          )}
        </ApiQueryState>
      </DialogContent>
    </Dialog>
  )
}

function CourseMetadataForm({ course }: { course: CourseDetail }) {
  const updateMutation = useUpdateCourseDetail()
  const primary = normalizeCourseLocalizations(course)[0]
  const { form, handleApiSubmit } = useApiForm<z.input<typeof metadataSchema>>({
    defaultValues: {
      audiences: course.audiences.join('\n'),
      description: primary?.description ?? '',
      outcomes: course.outcomes.join('\n'),
      priceAmount: course.priceAmount ?? '',
      priceCurrency: course.priceCurrency ?? '',
      requirements: course.requirements.join('\n'),
      title: primary?.title ?? course.slug,
    },
    resolver: zodResolver(metadataSchema),
    values: {
      audiences: course.audiences.join('\n'),
      description: primary?.description ?? '',
      outcomes: course.outcomes.join('\n'),
      priceAmount: course.priceAmount ?? '',
      priceCurrency: course.priceCurrency ?? '',
      requirements: course.requirements.join('\n'),
      title: primary?.title ?? course.slug,
    },
  })

  const onSubmit = handleApiSubmit(async (values) => {
    const promise = updateMutation.mutateAsync({
      body: {
        audiences: parseLines(values.audiences),
        description: values.description?.trim() || undefined,
        outcomes: parseLines(values.outcomes),
        priceAmount:
          typeof values.priceAmount === 'number'
            ? values.priceAmount
            : undefined,
        priceCurrency: values.priceCurrency
          ? values.priceCurrency.toUpperCase()
          : undefined,
        requirements: parseLines(values.requirements),
        title: values.title.trim(),
      },
      id: course.id,
    })
    toast.promise(promise, {
      loading: 'Saving course metadata...',
      success: 'Course metadata saved.',
      error: getApiErrorMessage,
    })
    await promise
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className='grid gap-4'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='grid gap-4 sm:grid-cols-2'>
          <FormField
            control={form.control}
            name='priceAmount'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price amount</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    min={1}
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
          <FormField
            control={form.control}
            name='priceCurrency'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price currency</FormLabel>
                <FormControl>
                  <Input maxLength={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {(['requirements', 'audiences', 'outcomes'] as const).map((name) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel className='capitalize'>{name}</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <DialogFooter>
          <Button type='submit' disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <Save className='size-4' />
            )}
            Save metadata
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

function CourseLocalizationForm({
  course,
  items,
}: {
  course: CourseDetail
  items: ReturnType<typeof normalizeCourseLocalizations>
}) {
  const upsertMutation = useUpsertCourseLocalization()
  const { form, handleApiSubmit } = useApiForm<
    z.input<typeof localizationSchema>
  >({
    defaultValues: {
      description: '',
      languageCode: course.defaultLanguage,
      releaseState: 'DRAFT',
      title: '',
    },
    resolver: zodResolver(localizationSchema),
  })
  const onSubmit = handleApiSubmit(async (values) => {
    const promise = upsertMutation.mutateAsync({
      body: {
        description: values.description?.trim() || undefined,
        languageCode: values.languageCode,
        releaseState: values.releaseState,
        title: values.title.trim(),
      },
      id: course.id,
    })
    toast.promise(promise, {
      loading: 'Saving localization...',
      success: 'Localization saved.',
      error: getApiErrorMessage,
    })
    await promise
    form.reset()
  })

  return (
    <div className='grid gap-4 lg:grid-cols-[1fr_320px]'>
      <Form {...form}>
        <form onSubmit={onSubmit} className='grid gap-4'>
          <FormField
            control={form.control}
            name='languageCode'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <SelectDropdown
                  defaultValue={field.value}
                  isControlled
                  items={LANGUAGE_OPTIONS}
                  onValueChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea rows={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' disabled={upsertMutation.isPending}>
            {upsertMutation.isPending ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <Save className='size-4' />
            )}
            Save localization
          </Button>
        </form>
      </Form>
      <div className='grid gap-2'>
        {items.map((item) => (
          <div key={item.languageCode} className='rounded-md border p-3'>
            <div className='font-medium'>{item.languageCode}</div>
            <div className='text-sm text-muted-foreground'>{item.title}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CourseFaqForm({
  course,
  items,
}: {
  course: CourseDetail
  items: ReturnType<typeof normalizeCourseFaqs>
}) {
  const setFaqsMutation = useSetCourseFaqs()
  const { form, handleApiSubmit } = useApiForm<z.input<typeof jsonListSchema>>({
    defaultValues: {
      value: JSON.stringify(
        items.map(({ answer, question }) => ({ answer, question })),
        null,
        2
      ),
    },
    resolver: zodResolver(jsonListSchema),
    values: {
      value: JSON.stringify(
        items.map(({ answer, question }) => ({ answer, question })),
        null,
        2
      ),
    },
  })
  const onSubmit = handleApiSubmit(async (values) => {
    const parsed = JSON.parse(values.value) as {
      answer: string
      question: string
    }[]
    const promise = setFaqsMutation.mutateAsync({
      body: createFaqsBody(parsed),
      id: course.id,
    })
    toast.promise(promise, {
      loading: 'Saving FAQs...',
      success: 'FAQs saved.',
      error: getApiErrorMessage,
    })
    await promise
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className='grid gap-4'>
        <FormField
          control={form.control}
          name='value'
          render={({ field }) => (
            <FormItem>
              <FormLabel>FAQ JSON</FormLabel>
              <FormControl>
                <Textarea rows={10} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={setFaqsMutation.isPending}>
          {setFaqsMutation.isPending ? (
            <Loader2 className='size-4 animate-spin' />
          ) : (
            <Save className='size-4' />
          )}
          Save FAQs
        </Button>
      </form>
    </Form>
  )
}

function CourseStructureEditor({
  course,
  sections,
}: {
  course: CourseDetail
  sections: CourseSection[]
}) {
  const addSectionMutation = useAddCourseSection()
  const addLessonMutation = useAddCourseLesson()
  const removeSectionMutation = useRemoveCourseSection()
  const removeLessonMutation = useRemoveCourseLesson()
  const [pendingSectionDelete, setPendingSectionDelete] =
    useState<CourseSection | null>(null)
  const [pendingLessonDelete, setPendingLessonDelete] =
    useState<CourseLesson | null>(null)
  const sectionForm = useApiForm<z.input<typeof sectionSchema>>({
    defaultValues: { position: '', title: '' },
    resolver: zodResolver(sectionSchema),
  })
  const lessonForm = useApiForm<
    z.input<typeof lessonSchema> & { sectionId: string }
  >({
    defaultValues: {
      durationSeconds: '',
      isPreview: false,
      position: '',
      sectionId: sections[0]?.id ?? '',
      textContent: '',
      title: '',
      type: 'TEXT',
      videoMediaId: '',
    },
    resolver: zodResolver(
      lessonSchema.extend({ sectionId: z.string().min(1) })
    ),
  })
  const onAddSection = sectionForm.handleApiSubmit(async (values) => {
    const promise = addSectionMutation.mutateAsync({
      body: {
        position:
          typeof values.position === 'number' ? values.position : undefined,
        title: values.title,
      },
      id: course.id,
    })
    toast.promise(promise, {
      loading: 'Adding section...',
      success: 'Section added.',
      error: getApiErrorMessage,
    })
    await promise
    sectionForm.form.reset({ position: '', title: '' })
  })
  const onAddLesson = lessonForm.handleApiSubmit(async (values) => {
    const promise = addLessonMutation.mutateAsync({
      body: {
        durationSeconds:
          typeof values.durationSeconds === 'number'
            ? values.durationSeconds
            : undefined,
        isPreview: values.isPreview,
        position:
          typeof values.position === 'number' ? values.position : undefined,
        textContent: values.textContent?.trim() || undefined,
        title: values.title,
        type: values.type,
        videoMediaId: values.videoMediaId || undefined,
      },
      sectionId: values.sectionId,
    })
    toast.promise(promise, {
      loading: 'Adding lesson...',
      success: 'Lesson added.',
      error: getApiErrorMessage,
    })
    await promise
    lessonForm.form.reset({
      durationSeconds: '',
      isPreview: false,
      position: '',
      sectionId: values.sectionId,
      textContent: '',
      title: '',
      type: 'TEXT',
      videoMediaId: '',
    })
  })

  async function removeSection() {
    if (!pendingSectionDelete) return
    await removeSectionMutation.mutateAsync(pendingSectionDelete.id)
    setPendingSectionDelete(null)
  }

  async function removeLesson() {
    if (!pendingLessonDelete) return
    await removeLessonMutation.mutateAsync(pendingLessonDelete.id)
    setPendingLessonDelete(null)
  }

  return (
    <div className='grid gap-5'>
      <div className='grid gap-4 lg:grid-cols-2'>
        <Form {...sectionForm.form}>
          <form
            onSubmit={onAddSection}
            className='grid gap-3 rounded-md border p-3'
          >
            <h3 className='font-medium'>Add section</h3>
            <FormField
              control={sectionForm.form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={addSectionMutation.isPending}>
              {addSectionMutation.isPending ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                <Plus className='size-4' />
              )}
              Add section
            </Button>
          </form>
        </Form>

        <Form {...lessonForm.form}>
          <form
            onSubmit={onAddLesson}
            className='grid gap-3 rounded-md border p-3'
          >
            <h3 className='font-medium'>Add lesson</h3>
            <FormField
              control={lessonForm.form.control}
              name='sectionId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section</FormLabel>
                  <FormControl>
                    <select
                      className='h-9 rounded-md border bg-background px-3 text-sm'
                      {...field}
                    >
                      {sections.map((section) => (
                        <option key={section.id} value={section.id}>
                          {section.title}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={lessonForm.form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={lessonForm.form.control}
              name='textContent'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text content</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type='submit'
              disabled={sections.length === 0 || addLessonMutation.isPending}
            >
              {addLessonMutation.isPending ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                <Plus className='size-4' />
              )}
              Add lesson
            </Button>
          </form>
        </Form>
      </div>

      {sections.length === 0 ? (
        <ApiEmpty
          title='No sections'
          description='Add a section before adding lessons.'
        />
      ) : (
        <div className='grid gap-3'>
          {sections.map((section) => (
            <div key={section.id} className='rounded-md border p-4'>
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <div className='font-semibold'>{section.title}</div>
                  <div className='text-sm text-muted-foreground'>
                    Position {section.position}
                  </div>
                </div>
                <Button
                  type='button'
                  size='sm'
                  variant='ghost'
                  onClick={() => setPendingSectionDelete(section)}
                >
                  <Trash2 className='size-4' />
                </Button>
              </div>
              <div className='mt-3 grid gap-2'>
                {normalizeSectionLessons(section).map((lesson) => (
                  <LessonRow
                    key={lesson.id}
                    lesson={lesson}
                    onDelete={() => setPendingLessonDelete(lesson)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingSectionDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingSectionDelete(null)
        }}
        title='Delete section?'
        desc='The backend will remove this section from the course.'
        destructive
        isLoading={removeSectionMutation.isPending}
        handleConfirm={() => void removeSection()}
      />
      <ConfirmDialog
        open={Boolean(pendingLessonDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingLessonDelete(null)
        }}
        title='Delete lesson?'
        desc='The backend will remove this lesson from the course.'
        destructive
        isLoading={removeLessonMutation.isPending}
        handleConfirm={() => void removeLesson()}
      />
    </div>
  )
}

function LessonRow({
  lesson,
  onDelete,
}: {
  lesson: CourseLesson
  onDelete: () => void
}) {
  const updateLessonMutation = useUpdateCourseLesson()
  const setAttachmentsMutation = useSetLessonAttachments()
  const setCaptionsMutation = useSetLessonCaptions()

  async function togglePreview() {
    const promise = updateLessonMutation.mutateAsync({
      body: { isPreview: !lesson.isPreview },
      id: lesson.id,
    })
    toast.promise(promise, {
      loading: 'Updating lesson...',
      success: 'Lesson updated.',
      error: getApiErrorMessage,
    })
    await promise
  }

  async function clearMediaLists() {
    await Promise.all([
      setAttachmentsMutation.mutateAsync({
        body: createAttachmentsBody(),
        id: lesson.id,
      }),
      setCaptionsMutation.mutateAsync({
        body: createCaptionsBody(),
        id: lesson.id,
      }),
    ])
  }

  return (
    <div className='flex flex-wrap items-center justify-between gap-2 rounded-md bg-muted/40 p-3'>
      <div>
        <div className='text-sm font-medium'>{lesson.title}</div>
        <div className='text-xs text-muted-foreground'>
          {lesson.type} - {formatCourseDuration(lesson.durationSeconds)}
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <Switch
          checked={lesson.isPreview}
          onCheckedChange={() => void togglePreview()}
        />
        <Button
          type='button'
          size='sm'
          variant='outline'
          disabled={
            setAttachmentsMutation.isPending || setCaptionsMutation.isPending
          }
          onClick={() => void clearMediaLists()}
        >
          Clear media lists
        </Button>
        <Button type='button' size='icon' variant='ghost' onClick={onDelete}>
          <Trash2 className='size-4' />
        </Button>
      </div>
    </div>
  )
}
