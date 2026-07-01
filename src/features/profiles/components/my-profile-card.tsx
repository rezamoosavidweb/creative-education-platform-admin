import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, Loader2, Save, Send, ShieldOff } from 'lucide-react'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api'
import { useApiForm } from '@/lib/forms'
import { useInvalidate } from '@/lib/query'
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ApiError, ApiLoading } from '@/components/api'
import { StatusPill } from '@/components/status-pill'
import { useChangeHandle } from '../hooks/use-change-handle'
import { useMyProfile } from '../hooks/use-my-profile'
import { usePublishProfile } from '../hooks/use-publish-profile'
import { useUnpublishProfile } from '../hooks/use-unpublish-profile'
import { useUpdateMyProfile } from '../hooks/use-update-my-profile'
import {
  formatProfileDateTime,
  profileQueryKeys,
} from '../services/profiles-query'
import type { ChangeHandleRequest, UpdateProfileRequest } from '../types'
import { ProfileDetailsDialog } from './profile-details-dialog'

const profileSchema = z.object({
  bio: z.string().max(2_000).nullable().optional(),
  city: z.string().max(120).nullable().optional(),
  country: z.string().max(120).nullable().optional(),
  displayName: z.string().max(120).nullable().optional(),
  headline: z.string().max(160).nullable().optional(),
  region: z.string().max(120).nullable().optional(),
})

export function MyProfileCard() {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const profileQuery = useMyProfile()
  const updateMutation = useUpdateMyProfile()
  const changeHandleMutation = useChangeHandle()
  const publishMutation = usePublishProfile()
  const unpublishMutation = useUnpublishProfile()
  const invalidate = useInvalidate()
  const profile = profileQuery.data?.data
  const profileForm = useApiForm<UpdateProfileRequest>({
    values: {
      bio: profile?.bio ?? '',
      city: profile?.city ?? '',
      country: profile?.country ?? '',
      displayName: profile?.displayName ?? '',
      headline: profile?.headline ?? '',
      region: profile?.region ?? '',
    },
    resolver: zodResolver(profileSchema),
  })
  const handleForm = useApiForm<ChangeHandleRequest>({
    values: {
      handle: profile?.handle ?? '',
    },
  })
  const handleRootError = getRootServerMessage(
    handleForm.form.formState.errors.root
  )

  const onSubmitProfile = profileForm.handleApiSubmit(async (values) => {
    const updatePromise = updateMutation.mutateAsync({
      bio: normalizeNullable(values.bio),
      city: normalizeNullable(values.city),
      country: normalizeNullable(values.country),
      displayName: normalizeNullable(values.displayName),
      headline: normalizeNullable(values.headline),
      region: normalizeNullable(values.region),
    })

    toast.promise(updatePromise, {
      loading: 'Updating profile...',
      success: 'Profile updated.',
      error: getApiErrorMessage,
    })

    await updatePromise
  })

  const onSubmitHandle = handleForm.handleApiSubmit(async (values) => {
    const handlePromise = changeHandleMutation.mutateAsync({
      handle: values.handle,
    })

    toast.promise(handlePromise, {
      loading: 'Changing handle...',
      success: 'Handle changed.',
      error: getApiErrorMessage,
    })

    await handlePromise
  })

  const togglePublish = async () => {
    const mutation = profile?.published ? unpublishMutation : publishMutation
    const promise = mutation.mutateAsync(undefined)

    toast.promise(promise, {
      loading: profile?.published
        ? 'Unpublishing profile...'
        : 'Publishing profile...',
      success: profile?.published
        ? 'Profile unpublished.'
        : 'Profile published.',
      error: getApiErrorMessage,
    })

    await promise
    window.setTimeout(() => {
      void invalidate(profileQueryKeys.directory())
    }, 1_500)
  }

  return (
    <>
      <Card className='border border-[var(--bdr)] bg-[var(--sur)]'>
        <CardHeader>
          <div className='flex flex-wrap items-start justify-between gap-3'>
            <div>
              <CardTitle>My profile</CardTitle>
              <CardDescription>
                Public identity, location, and directory visibility.
              </CardDescription>
            </div>
            {profile && (
              <StatusPill tone={profile.published ? 'ok' : 'neutral'}>
                {profile.published ? 'Published' : 'Private'}
              </StatusPill>
            )}
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          {profileQuery.isLoading && <ApiLoading label='Loading profile...' />}
          {profileQuery.error && (
            <ApiError
              error={profileQuery.error}
              onRetry={profileQuery.refetch}
            />
          )}
          {profile && (
            <>
              <div className='grid gap-4 text-sm sm:grid-cols-3'>
                <Detail label='Handle'>@{profile.handle}</Detail>
                <Detail label='Created'>
                  {formatProfileDateTime(profile.createdAt)}
                </Detail>
                <Detail label='Updated'>
                  {formatProfileDateTime(profile.updatedAt)}
                </Detail>
              </div>

              <Form {...profileForm.form}>
                <form onSubmit={onSubmitProfile} className='space-y-4'>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <ProfileInput
                      control={profileForm.form.control}
                      disabled={updateMutation.isPending}
                      label='Display name'
                      name='displayName'
                    />
                    <ProfileInput
                      control={profileForm.form.control}
                      disabled={updateMutation.isPending}
                      label='Headline'
                      name='headline'
                    />
                    <ProfileInput
                      control={profileForm.form.control}
                      disabled={updateMutation.isPending}
                      label='Country'
                      name='country'
                    />
                    <ProfileInput
                      control={profileForm.form.control}
                      disabled={updateMutation.isPending}
                      label='Region'
                      name='region'
                    />
                    <ProfileInput
                      control={profileForm.form.control}
                      disabled={updateMutation.isPending}
                      label='City'
                      name='city'
                    />
                  </div>
                  <FormField
                    control={profileForm.form.control}
                    name='bio'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            className='resize-none'
                            disabled={updateMutation.isPending}
                            value={field.value ?? ''}
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
                  <Button type='submit' disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? (
                      <Loader2 className='size-4 animate-spin' />
                    ) : (
                      <Save className='size-4' />
                    )}
                    Update profile
                  </Button>
                </form>
              </Form>

              <Form {...handleForm.form}>
                <form onSubmit={onSubmitHandle} className='space-y-3'>
                  <FormField
                    control={handleForm.form.control}
                    name='handle'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Handle</FormLabel>
                        <div className='flex flex-col gap-2 sm:flex-row'>
                          <FormControl>
                            <Input
                              disabled={changeHandleMutation.isPending}
                              value={field.value ?? ''}
                              onBlur={field.onBlur}
                              onChange={field.onChange}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <Button
                            type='submit'
                            disabled={changeHandleMutation.isPending}
                          >
                            {changeHandleMutation.isPending ? (
                              <Loader2 className='size-4 animate-spin' />
                            ) : (
                              <Save className='size-4' />
                            )}
                            Change handle
                          </Button>
                        </div>
                        <FormDescription>
                          Used for public profile lookup.
                        </FormDescription>
                        {handleRootError && (
                          <p className='text-sm font-medium text-destructive'>
                            {handleRootError}
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>

              <div className='flex flex-wrap gap-2'>
                <Button
                  type='button'
                  variant={profile.published ? 'outline' : 'default'}
                  disabled={
                    publishMutation.isPending || unpublishMutation.isPending
                  }
                  onClick={() => {
                    void togglePublish()
                  }}
                >
                  {publishMutation.isPending || unpublishMutation.isPending ? (
                    <Loader2 className='size-4 animate-spin' />
                  ) : profile.published ? (
                    <ShieldOff className='size-4' />
                  ) : (
                    <Send className='size-4' />
                  )}
                  {profile.published ? 'Unpublish profile' : 'Publish profile'}
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  disabled={!profile.published}
                  onClick={() => setDetailsOpen(true)}
                >
                  <Eye className='size-4' />
                  View public profile
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <ProfileDetailsDialog
        handle={profile?.published ? profile.handle : null}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </>
  )
}

function ProfileInput({
  control,
  disabled,
  label,
  name,
}: {
  control: ReturnType<
    typeof useApiForm<UpdateProfileRequest>
  >['form']['control']
  disabled: boolean
  label: string
  name: keyof UpdateProfileRequest
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
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
  )
}

function Detail({
  children,
  label,
}: {
  children: React.ReactNode
  label: string
}) {
  return (
    <div className='space-y-1'>
      <div className='text-xs font-medium text-muted-foreground'>{label}</div>
      <div className='text-[var(--t1)]'>{children}</div>
    </div>
  )
}

function normalizeNullable(value: string | null | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

function getRootServerMessage(error: unknown): string | null {
  if (!error || typeof error !== 'object') return null
  const server = (error as { server?: { message?: unknown } }).server
  return typeof server?.message === 'string' ? server.message : null
}
