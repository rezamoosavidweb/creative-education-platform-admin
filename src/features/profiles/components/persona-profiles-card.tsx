import { Loader2, Plus, Save } from 'lucide-react'
import { toast } from 'sonner'
import { getApiErrorMessage, isApiError } from '@/lib/api'
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
import { Switch } from '@/components/ui/switch'
import { ApiError as ApiErrorState, ApiLoading } from '@/components/api'
import { SelectDropdown } from '@/components/select-dropdown'
import { StatusPill } from '@/components/status-pill'
import { useChangePractitionerAvailability } from '../hooks/use-change-practitioner-availability'
import { useEnsureInstructorProfile } from '../hooks/use-ensure-instructor-profile'
import { useEnsurePractitionerProfile } from '../hooks/use-ensure-practitioner-profile'
import { useEnsureStudioProfile } from '../hooks/use-ensure-studio-profile'
import { useInstructorProfile } from '../hooks/use-instructor-profile'
import { usePractitionerProfile } from '../hooks/use-practitioner-profile'
import { useStudioProfile } from '../hooks/use-studio-profile'
import { useUpdateInstructorProfile } from '../hooks/use-update-instructor-profile'
import { useUpdateStudioProfile } from '../hooks/use-update-studio-profile'
import {
  AVAILABILITY_STATUS_OPTIONS,
  getVerificationStatusTone,
} from '../services/profiles-query'
import type {
  ChangeAvailabilityRequest,
  UpdateInstructorRequest,
  UpdateStudioRequest,
} from '../types'

export function PersonaProfilesCard() {
  return (
    <Card className='border border-[var(--bdr)] bg-[var(--sur)]'>
      <CardHeader>
        <CardTitle>Persona profiles</CardTitle>
        <CardDescription>
          Practitioner, instructor, and studio profile records.
        </CardDescription>
      </CardHeader>
      <CardContent className='grid gap-4 xl:grid-cols-3'>
        <PractitionerProfilePanel />
        <InstructorProfilePanel />
        <StudioProfilePanel />
      </CardContent>
    </Card>
  )
}

function PractitionerProfilePanel() {
  const query = usePractitionerProfile()
  const ensureMutation = useEnsurePractitionerProfile()
  const updateMutation = useChangePractitionerAvailability()
  const profile = query.data?.data
  const form = useApiForm<ChangeAvailabilityRequest>({
    values: {
      availableForCollaboration: profile?.availableForCollaboration ?? false,
      availableForHire: profile?.availableForHire ?? false,
      status: profile?.availabilityStatus,
    },
  })
  const onSubmit = form.handleApiSubmit(async (values) => {
    const promise = updateMutation.mutateAsync({
      availableForCollaboration: values.availableForCollaboration,
      availableForHire: values.availableForHire,
      status: normalizeOptional(values.status),
    })

    toast.promise(promise, {
      loading: 'Updating practitioner profile...',
      success: 'Practitioner profile updated.',
      error: getApiErrorMessage,
    })

    await promise
  })

  return (
    <PersonaPanel
      title='Practitioner'
      isLoading={query.isLoading}
      error={query.error}
      onRetry={query.refetch}
      createLabel='Create practitioner profile'
      isCreating={ensureMutation.isPending}
      onCreate={() => {
        const promise = ensureMutation.mutateAsync(undefined)
        toast.promise(promise, {
          loading: 'Creating practitioner profile...',
          success: 'Practitioner profile ready.',
          error: getApiErrorMessage,
        })
      }}
    >
      {profile && (
        <Form {...form.form}>
          <form onSubmit={onSubmit} className='space-y-4'>
            <PersonaStatus
              status={profile.availabilityStatus}
              verificationStatus={profile.verificationStatus}
            />
            <FormField
              control={form.form.control}
              name='availableForHire'
              render={({ field }) => (
                <SwitchField
                  checked={!!field.value}
                  disabled={updateMutation.isPending}
                  label='Available for hire'
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <FormField
              control={form.form.control}
              name='availableForCollaboration'
              render={({ field }) => (
                <SwitchField
                  checked={!!field.value}
                  disabled={updateMutation.isPending}
                  label='Available for collaboration'
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <FormField
              control={form.form.control}
              name='status'
              render={({ field }) => (
                <AvailabilityStatusField
                  disabled={updateMutation.isPending}
                  field={field}
                />
              )}
            />
            <ReferenceSummary
              disciplines={profile.disciplineIds.length}
              genres={profile.genreIds.length}
              skills={profile.skillIds.length}
              specializations={profile.specializationIds.length}
            />
            <SaveButton pending={updateMutation.isPending} />
          </form>
        </Form>
      )}
    </PersonaPanel>
  )
}

function InstructorProfilePanel() {
  const query = useInstructorProfile()
  const ensureMutation = useEnsureInstructorProfile()
  const updateMutation = useUpdateInstructorProfile()
  const profile = query.data?.data
  const form = useApiForm<UpdateInstructorRequest>({
    values: {
      availabilityStatus: profile?.availabilityStatus,
      availableForHire: profile?.availableForHire ?? false,
      rateAmount: profile?.rateAmount,
      rateCurrency: profile?.rateCurrency ?? '',
    },
  })
  const onSubmit = form.handleApiSubmit(async (values) => {
    const promise = updateMutation.mutateAsync({
      availabilityStatus: normalizeOptional(values.availabilityStatus),
      availableForHire: values.availableForHire,
      rateAmount: normalizeNumber(values.rateAmount),
      rateCurrency: normalizeOptional(values.rateCurrency),
    })

    toast.promise(promise, {
      loading: 'Updating instructor profile...',
      success: 'Instructor profile updated.',
      error: getApiErrorMessage,
    })

    await promise
  })

  return (
    <PersonaPanel
      title='Instructor'
      isLoading={query.isLoading}
      error={query.error}
      onRetry={query.refetch}
      createLabel='Create instructor profile'
      isCreating={ensureMutation.isPending}
      onCreate={() => {
        const promise = ensureMutation.mutateAsync(undefined)
        toast.promise(promise, {
          loading: 'Creating instructor profile...',
          success: 'Instructor profile ready.',
          error: getApiErrorMessage,
        })
      }}
    >
      {profile && (
        <Form {...form.form}>
          <form onSubmit={onSubmit} className='space-y-4'>
            <PersonaStatus
              status={profile.availabilityStatus}
              verificationStatus={profile.verificationStatus}
            />
            <FormField
              control={form.form.control}
              name='availableForHire'
              render={({ field }) => (
                <SwitchField
                  checked={!!field.value}
                  disabled={updateMutation.isPending}
                  label='Available for hire'
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <InstructorAvailabilityInput
              disabled={updateMutation.isPending}
              control={form.form.control}
            />
            <InstructorRateFields
              disabled={updateMutation.isPending}
              control={form.form.control}
            />
            <SaveButton pending={updateMutation.isPending} />
          </form>
        </Form>
      )}
    </PersonaPanel>
  )
}

function StudioProfilePanel() {
  const query = useStudioProfile()
  const ensureMutation = useEnsureStudioProfile()
  const updateMutation = useUpdateStudioProfile()
  const profile = query.data?.data
  const form = useApiForm<UpdateStudioRequest>({
    values: {
      availabilityStatus: profile?.availabilityStatus,
      rateAmount: profile?.rateAmount,
      rateCurrency: profile?.rateCurrency ?? '',
    },
  })
  const onSubmit = form.handleApiSubmit(async (values) => {
    const promise = updateMutation.mutateAsync({
      availabilityStatus: normalizeOptional(values.availabilityStatus),
      rateAmount: normalizeNumber(values.rateAmount),
      rateCurrency: normalizeOptional(values.rateCurrency),
    })

    toast.promise(promise, {
      loading: 'Updating studio profile...',
      success: 'Studio profile updated.',
      error: getApiErrorMessage,
    })

    await promise
  })

  return (
    <PersonaPanel
      title='Studio'
      isLoading={query.isLoading}
      error={query.error}
      onRetry={query.refetch}
      createLabel='Create studio profile'
      isCreating={ensureMutation.isPending}
      onCreate={() => {
        const promise = ensureMutation.mutateAsync(undefined)
        toast.promise(promise, {
          loading: 'Creating studio profile...',
          success: 'Studio profile ready.',
          error: getApiErrorMessage,
        })
      }}
    >
      {profile && (
        <Form {...form.form}>
          <form onSubmit={onSubmit} className='space-y-4'>
            <PersonaStatus
              status={profile.availabilityStatus}
              verificationStatus={profile.verificationStatus}
            />
            <StudioAvailabilityInput
              disabled={updateMutation.isPending}
              control={form.form.control}
            />
            <StudioRateFields
              disabled={updateMutation.isPending}
              control={form.form.control}
            />
            <SaveButton pending={updateMutation.isPending} />
          </form>
        </Form>
      )}
    </PersonaPanel>
  )
}

function PersonaPanel({
  children,
  createLabel,
  error,
  isCreating,
  isLoading,
  onCreate,
  onRetry,
  title,
}: {
  children: React.ReactNode
  createLabel: string
  error: unknown
  isCreating: boolean
  isLoading: boolean
  onCreate: () => void
  onRetry: () => void
  title: string
}) {
  const missing = isMissingPersona(error)

  return (
    <div className='rounded-lg border border-[var(--bdr)] bg-[var(--sur2)] p-4'>
      <div className='mb-4 flex items-center justify-between gap-3'>
        <h3 className='text-sm font-semibold text-[var(--t1)]'>{title}</h3>
      </div>

      {isLoading && <ApiLoading label={`Loading ${title.toLowerCase()}...`} />}
      {!!error && !missing && <ApiErrorState error={error} onRetry={onRetry} />}
      {missing && (
        <div className='space-y-3'>
          <p className='text-sm text-muted-foreground'>No record exists yet.</p>
          <Button
            type='button'
            variant='outline'
            disabled={isCreating}
            onClick={onCreate}
          >
            {isCreating ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <Plus className='size-4' />
            )}
            {createLabel}
          </Button>
        </div>
      )}
      {!isLoading && !error && children}
    </div>
  )
}

function PersonaStatus({
  status,
  verificationStatus,
}: {
  status: string
  verificationStatus: Parameters<typeof getVerificationStatusTone>[0]
}) {
  return (
    <div className='flex flex-wrap gap-2'>
      <StatusPill tone='neutral'>{status}</StatusPill>
      <StatusPill tone={getVerificationStatusTone(verificationStatus)}>
        {verificationStatus}
      </StatusPill>
    </div>
  )
}

function SwitchField({
  checked,
  disabled,
  label,
  onCheckedChange,
}: {
  checked: boolean
  disabled: boolean
  label: string
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <FormItem className='flex items-center justify-between gap-3 rounded-md border border-[var(--bdr)] px-3 py-2'>
      <FormLabel className='text-sm'>{label}</FormLabel>
      <FormControl>
        <Switch
          checked={checked}
          disabled={disabled}
          onCheckedChange={onCheckedChange}
        />
      </FormControl>
    </FormItem>
  )
}

function InstructorAvailabilityInput({
  control,
  disabled,
}: {
  control: ReturnType<
    typeof useApiForm<UpdateInstructorRequest>
  >['form']['control']
  disabled: boolean
}) {
  return (
    <FormField
      control={control}
      name='availabilityStatus'
      render={({ field }) => (
        <AvailabilityStatusField disabled={disabled} field={field} />
      )}
    />
  )
}

function StudioAvailabilityInput({
  control,
  disabled,
}: {
  control: ReturnType<typeof useApiForm<UpdateStudioRequest>>['form']['control']
  disabled: boolean
}) {
  return (
    <FormField
      control={control}
      name='availabilityStatus'
      render={({ field }) => (
        <AvailabilityStatusField disabled={disabled} field={field} />
      )}
    />
  )
}

function AvailabilityStatusField({
  disabled,
  field,
}: {
  disabled: boolean
  field: {
    name: string
    onBlur: () => void
    onChange: (value: string) => void
    ref: React.Ref<unknown>
    value: unknown
  }
}) {
  return (
    <FormItem>
      <FormLabel>Availability status</FormLabel>
      <SelectDropdown
        defaultValue={typeof field.value === 'string' ? field.value : ''}
        disabled={disabled}
        isControlled
        items={AVAILABILITY_STATUS_OPTIONS}
        onValueChange={field.onChange}
      />
      <FormMessage />
    </FormItem>
  )
}

function InstructorRateFields({
  control,
  disabled,
}: {
  control: ReturnType<
    typeof useApiForm<UpdateInstructorRequest>
  >['form']['control']
  disabled: boolean
}) {
  return (
    <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2'>
      <FormField
        control={control}
        name='rateAmount'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rate amount</FormLabel>
            <FormControl>
              <Input
                disabled={disabled}
                type='number'
                value={typeof field.value === 'number' ? field.value : ''}
                onBlur={field.onBlur}
                onChange={(event) => {
                  const next = event.target.value
                  field.onChange(next === '' ? undefined : Number(next))
                }}
                name={field.name}
                ref={field.ref}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='rateCurrency'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rate currency</FormLabel>
            <FormControl>
              <Input
                disabled={disabled}
                value={typeof field.value === 'string' ? field.value : ''}
                onBlur={field.onBlur}
                onChange={field.onChange}
                name={field.name}
                ref={field.ref}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

function StudioRateFields({
  control,
  disabled,
}: {
  control: ReturnType<typeof useApiForm<UpdateStudioRequest>>['form']['control']
  disabled: boolean
}) {
  return (
    <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2'>
      <FormField
        control={control}
        name='rateAmount'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rate amount</FormLabel>
            <FormControl>
              <Input
                disabled={disabled}
                type='number'
                value={typeof field.value === 'number' ? field.value : ''}
                onBlur={field.onBlur}
                onChange={(event) => {
                  const next = event.target.value
                  field.onChange(next === '' ? undefined : Number(next))
                }}
                name={field.name}
                ref={field.ref}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='rateCurrency'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rate currency</FormLabel>
            <FormControl>
              <Input
                disabled={disabled}
                value={typeof field.value === 'string' ? field.value : ''}
                onBlur={field.onBlur}
                onChange={field.onChange}
                name={field.name}
                ref={field.ref}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

function ReferenceSummary({
  disciplines,
  genres,
  skills,
  specializations,
}: {
  disciplines: number
  genres: number
  skills: number
  specializations: number
}) {
  return (
    <div className='grid grid-cols-2 gap-2 text-xs text-muted-foreground'>
      <span>Disciplines: {disciplines.toLocaleString()}</span>
      <span>Specializations: {specializations.toLocaleString()}</span>
      <span>Genres: {genres.toLocaleString()}</span>
      <span>Skills: {skills.toLocaleString()}</span>
    </div>
  )
}

function SaveButton({ pending }: { pending: boolean }) {
  return (
    <Button type='submit' disabled={pending}>
      {pending ? (
        <Loader2 className='size-4 animate-spin' />
      ) : (
        <Save className='size-4' />
      )}
      Save
    </Button>
  )
}

function isMissingPersona(error: unknown): boolean {
  return isApiError(error) && error.status === 404
}

function normalizeOptional<TValue extends string>(
  value: TValue | null | undefined
): TValue | undefined {
  const trimmed = value?.trim()
  return trimmed ? (trimmed as TValue) : undefined
}

function normalizeNumber(value: number | undefined): number | undefined {
  return Number.isFinite(value) ? value : undefined
}
