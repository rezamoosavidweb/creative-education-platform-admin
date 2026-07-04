import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { BookOpen, Loader2 } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import { SelectDropdown } from '@/components/select-dropdown'
import { useCreateCourse } from '../hooks/use-create-course'
import { LANGUAGE_OPTIONS } from '../services/courses-query'
import type { CreateCourseRequest } from '../types'

const createCourseSchema = z.object({
  defaultLanguage: z.enum(['en_US', 'ru_RU']),
  description: z.string().trim().max(5000).optional(),
  title: z
    .string()
    .trim()
    .min(2, 'Title must be at least 2 characters.')
    .max(160),
})

type CreateCourseDialogProps = {
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function CreateCourseDialog({
  onOpenChange,
  open,
}: CreateCourseDialogProps) {
  const createMutation = useCreateCourse()
  const { form, handleApiSubmit } = useApiForm<CreateCourseRequest>({
    defaultValues: {
      defaultLanguage: 'en_US',
      description: '',
      title: '',
    },
    resolver: zodResolver(createCourseSchema),
  })

  const onSubmit = handleApiSubmit(async (values) => {
    const createPromise = createMutation.mutateAsync({
      defaultLanguage: values.defaultLanguage,
      description: values.description?.trim() || undefined,
      title: values.title.trim(),
    })

    toast.promise(createPromise, {
      loading: 'Creating course...',
      success: 'Course draft created.',
      error: getApiErrorMessage,
    })

    await createPromise
    form.reset()
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New course</DialogTitle>
          <DialogDescription>
            Create a draft course for the current authenticated author.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id='create-course-form' onSubmit={onSubmit}>
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input disabled={createMutation.isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='defaultLanguage'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default language</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      disabled={createMutation.isPending}
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
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={createMutation.isPending}
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button
            type='submit'
            form='create-course-form'
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <BookOpen className='size-4' />
            )}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
