import { z } from 'zod'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Briefcase, Loader2, Store } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import {
  useApplyToMarketplaceJob,
  useCreateMarketplaceService,
  usePostMarketplaceJob,
} from '../hooks/use-marketplace-queries'
import type {
  ListServiceRequest,
  MarketplaceJob,
  PostJobRequest,
  SubmitApplicationRequest,
} from '../types'

const taxonomySchema = {
  disciplineIds: z.string().trim().optional(),
  genreIds: z.string().trim().optional(),
  skillIds: z.string().trim().optional(),
  specializationIds: z.string().trim().optional(),
}

const optionalMoneyAmount = z
  .string()
  .trim()
  .refine((value) => {
    if (!value) return true
    const numericValue = Number(value)

    return Number.isInteger(numericValue) && numericValue >= 0
  }, 'Amount must be a whole number of minor units.')
  .optional()

const serviceSchema = z.object({
  description: z.string().trim().max(5000).optional(),
  priceAmount: optionalMoneyAmount,
  priceCurrency: z.string().trim().max(3).optional(),
  title: z.string().trim().min(1, 'Title is required.').max(160),
  ...taxonomySchema,
})

const jobSchema = z.object({
  budgetAmount: optionalMoneyAmount,
  budgetCurrency: z.string().trim().max(3).optional(),
  city: z.string().trim().max(120).optional(),
  description: z.string().trim().max(5000).optional(),
  isRemote: z.boolean().optional(),
  title: z.string().trim().min(1, 'Title is required.').max(160),
  ...taxonomySchema,
})

const applicationSchema = z.object({
  proposal: z.string().trim().max(5000).optional(),
  proposedRateAmount: optionalMoneyAmount,
  proposedRateCurrency: z.string().trim().max(3).optional(),
})

function parseTags(value: string | undefined) {
  return value
    ? value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : undefined
}

type CreateServiceDialogProps = {
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function CreateServiceDialog({
  onOpenChange,
  open,
}: CreateServiceDialogProps) {
  const createMutation = useCreateMarketplaceService()
  const { form, handleApiSubmit } = useApiForm<z.input<typeof serviceSchema>>({
    defaultValues: {
      description: '',
      disciplineIds: '',
      genreIds: '',
      priceAmount: '',
      priceCurrency: 'USD',
      skillIds: '',
      specializationIds: '',
      title: '',
    },
    resolver: zodResolver(serviceSchema),
  })

  const onSubmit = handleApiSubmit(async (values) => {
    const body: ListServiceRequest = {
      description: values.description || undefined,
      disciplineIds: parseTags(values.disciplineIds),
      genreIds: parseTags(values.genreIds),
      priceAmount: values.priceAmount ? Number(values.priceAmount) : undefined,
      priceCurrency: values.priceCurrency || undefined,
      skillIds: parseTags(values.skillIds),
      specializationIds: parseTags(values.specializationIds),
      title: values.title.trim(),
    }
    const promise = createMutation.mutateAsync(body)

    toast.promise(promise, {
      loading: 'Creating service...',
      success: 'Service draft created.',
      error: getApiErrorMessage,
    })

    await promise
    form.reset()
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New service</DialogTitle>
          <DialogDescription>
            Create a draft marketplace service listing.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id='create-service-form' onSubmit={onSubmit}>
            <MarketplaceFields
              control={form.control}
              isPending={createMutation.isPending}
              moneyAmountName='priceAmount'
              moneyCurrencyName='priceCurrency'
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            type='submit'
            form='create-service-form'
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <Store className='size-4' />
            )}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type PostJobDialogProps = {
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function PostJobDialog({ onOpenChange, open }: PostJobDialogProps) {
  const postMutation = usePostMarketplaceJob()
  const { form, handleApiSubmit } = useApiForm<z.input<typeof jobSchema>>({
    defaultValues: {
      budgetAmount: '',
      budgetCurrency: 'USD',
      city: '',
      description: '',
      disciplineIds: '',
      genreIds: '',
      isRemote: true,
      skillIds: '',
      specializationIds: '',
      title: '',
    },
    resolver: zodResolver(jobSchema),
  })

  const onSubmit = handleApiSubmit(async (values) => {
    const body: PostJobRequest = {
      budgetAmount: values.budgetAmount
        ? Number(values.budgetAmount)
        : undefined,
      budgetCurrency: values.budgetCurrency || undefined,
      city: values.city || undefined,
      description: values.description || undefined,
      disciplineIds: parseTags(values.disciplineIds),
      genreIds: parseTags(values.genreIds),
      isRemote: values.isRemote,
      skillIds: parseTags(values.skillIds),
      specializationIds: parseTags(values.specializationIds),
      title: values.title.trim(),
    }
    const promise = postMutation.mutateAsync(body)

    toast.promise(promise, {
      loading: 'Posting job...',
      success: 'Job posted.',
      error: getApiErrorMessage,
    })

    await promise
    form.reset()
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New job</DialogTitle>
          <DialogDescription>Post a marketplace hiring job.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id='post-job-form' onSubmit={onSubmit}>
            <MarketplaceFields
              control={form.control}
              isPending={postMutation.isPending}
              moneyAmountName='budgetAmount'
              moneyCurrencyName='budgetCurrency'
              showRemote
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            type='submit'
            form='post-job-form'
            disabled={postMutation.isPending}
          >
            {postMutation.isPending ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <Briefcase className='size-4' />
            )}
            Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type ApplyJobDialogProps = {
  job: MarketplaceJob | null
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function ApplyJobDialog({
  job,
  onOpenChange,
  open,
}: ApplyJobDialogProps) {
  const applyMutation = useApplyToMarketplaceJob()
  const { form, handleApiSubmit } = useApiForm<
    z.input<typeof applicationSchema>
  >({
    defaultValues: {
      proposal: '',
      proposedRateAmount: '',
      proposedRateCurrency: 'USD',
    },
    resolver: zodResolver(applicationSchema),
  })

  const onSubmit = handleApiSubmit(async (values) => {
    if (!job) return

    const body: SubmitApplicationRequest = {
      proposal: values.proposal || undefined,
      proposedRateAmount: values.proposedRateAmount
        ? Number(values.proposedRateAmount)
        : undefined,
      proposedRateCurrency: values.proposedRateCurrency || undefined,
    }
    const promise = applyMutation.mutateAsync({ body, jobId: job.id })

    toast.promise(promise, {
      loading: 'Submitting application...',
      success: 'Application submitted.',
      error: getApiErrorMessage,
    })

    await promise
    form.reset()
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply to {job?.title ?? 'job'}</DialogTitle>
          <DialogDescription>
            Submit your proposal and optional proposed rate.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id='apply-job-form' onSubmit={onSubmit}>
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='proposal'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proposal</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={applyMutation.isPending}
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='grid gap-4 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='proposedRateAmount'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rate amount</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          min={0}
                          disabled={applyMutation.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='proposedRateCurrency'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <Input disabled={applyMutation.isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button
            type='submit'
            form='apply-job-form'
            disabled={applyMutation.isPending}
          >
            {applyMutation.isPending && (
              <Loader2 className='size-4 animate-spin' />
            )}
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type MarketplaceFieldsProps<T extends FieldValues> = {
  control: Control<T>
  isPending: boolean
  moneyAmountName: Path<T>
  moneyCurrencyName: Path<T>
  showRemote?: boolean
}

function MarketplaceFields<T extends FieldValues>({
  control,
  isPending,
  moneyAmountName,
  moneyCurrencyName,
  showRemote = false,
}: MarketplaceFieldsProps<T>) {
  return (
    <div className='grid gap-4'>
      <FormField
        control={control}
        name={'title' as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input disabled={isPending} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={'description' as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea disabled={isPending} rows={4} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className='grid gap-4 sm:grid-cols-2'>
        <FormField
          control={control}
          name={moneyAmountName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount in minor units</FormLabel>
              <FormControl>
                <Input type='number' min={0} disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={moneyCurrencyName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <FormControl>
                <Input disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {showRemote && (
        <div className='grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end'>
          <FormField
            control={control}
            name={'city' as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input disabled={isPending} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={'isRemote' as Path<T>}
            render={({ field }) => (
              <FormItem className='flex min-h-10 items-center justify-between gap-3 rounded-md border border-[var(--bdr)] px-3 py-2'>
                <FormLabel className='text-sm'>Remote</FormLabel>
                <FormControl>
                  <Switch
                    checked={Boolean(field.value)}
                    disabled={isPending}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      )}
      <div className='grid gap-4 sm:grid-cols-2'>
        <FormField
          control={control}
          name={'disciplineIds' as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discipline IDs</FormLabel>
              <FormControl>
                <Input
                  placeholder='Comma separated'
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={'specializationIds' as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialization IDs</FormLabel>
              <FormControl>
                <Input
                  placeholder='Comma separated'
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={'genreIds' as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Genre IDs</FormLabel>
              <FormControl>
                <Input
                  placeholder='Comma separated'
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={'skillIds' as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skill IDs</FormLabel>
              <FormControl>
                <Input
                  placeholder='Comma separated'
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
