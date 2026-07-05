import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Loader2,
  Play,
  Plus,
  RefreshCw,
  Save,
  Send,
  SlidersHorizontal,
} from 'lucide-react'
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
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { ApiEmpty, ApiQueryState } from '@/components/api'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { StatusPill } from '@/components/status-pill'
import {
  useCreateNotificationTemplate,
  useNotificationPreferences,
  useNotificationTemplates,
  useProcessNotificationDeliveries,
  useRetryNotificationDeadLetters,
  useSendNotification,
  useUpdateNotificationPreferences,
  useUpdateNotificationTemplate,
} from '../hooks/use-notification-admin'
import {
  filterTemplates,
  formatQuietHour,
  getTemplates,
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_LANGUAGES,
  parseOptionalMinute,
  parseVariablesJson,
  type NotificationTemplate,
} from '../services/notifications-query'

const templateSchema = z.object({
  body: z.string().trim().min(1).max(4000),
  channel: z.enum(NOTIFICATION_CHANNELS),
  isActive: z.boolean(),
  key: z.string().trim().min(2).max(120),
  language: z.enum(NOTIFICATION_LANGUAGES),
  subject: z.string().trim().max(200).optional(),
})

const preferenceSchema = z.object({
  digestEnabled: z.boolean(),
  emailEnabled: z.boolean(),
  language: z.enum(NOTIFICATION_LANGUAGES),
  marketingEnabled: z.boolean(),
  miniAppEnabled: z.boolean(),
  pushEnabled: z.boolean(),
  quietHoursEnd: z.string(),
  quietHoursStart: z.string(),
  smsEnabled: z.boolean(),
  systemEnabled: z.boolean(),
  timezone: z.string().trim().max(64).optional(),
})

const dispatchSchema = z.object({
  category: z.enum(NOTIFICATION_CATEGORIES),
  templateKey: z.string().trim().min(2).max(120),
  userId: z.string().uuid('Enter a valid backend user ID.'),
  variables: z.string(),
})

type NotificationTemplateDialogProps = {
  onOpenChange: (open: boolean) => void
  open: boolean
  template: NotificationTemplate | null
}

export function NotificationPreferencesPanel() {
  const preferencesQuery = useNotificationPreferences()
  const updateMutation = useUpdateNotificationPreferences()
  const preferences = preferencesQuery.data
  const isPending = updateMutation.isPending
  const { form, handleApiSubmit } = useApiForm<
    z.input<typeof preferenceSchema>
  >({
    defaultValues: {
      digestEnabled: false,
      emailEnabled: true,
      language: 'en_US',
      marketingEnabled: false,
      miniAppEnabled: true,
      pushEnabled: true,
      quietHoursEnd: '',
      quietHoursStart: '',
      smsEnabled: true,
      systemEnabled: true,
      timezone: '',
    },
    resolver: zodResolver(preferenceSchema),
    values: preferences
      ? {
          digestEnabled: preferences.digestEnabled,
          emailEnabled: preferences.emailEnabled,
          language: preferences.language,
          marketingEnabled: preferences.marketingEnabled,
          miniAppEnabled: preferences.miniAppEnabled,
          pushEnabled: preferences.pushEnabled,
          quietHoursEnd:
            preferences.quietHoursEnd === null ||
            preferences.quietHoursEnd === undefined
              ? ''
              : String(preferences.quietHoursEnd),
          quietHoursStart:
            preferences.quietHoursStart === null ||
            preferences.quietHoursStart === undefined
              ? ''
              : String(preferences.quietHoursStart),
          smsEnabled: preferences.smsEnabled,
          systemEnabled: preferences.systemEnabled,
          timezone: preferences.timezone ?? '',
        }
      : undefined,
  })

  const onSubmit = handleApiSubmit(async (values) => {
    const quietHoursStart = parseOptionalMinute(values.quietHoursStart)
    const quietHoursEnd = parseOptionalMinute(values.quietHoursEnd)
    const promise = updateMutation.mutateAsync({
      ...values,
      quietHoursEnd: quietHoursEnd ?? undefined,
      quietHoursStart: quietHoursStart ?? undefined,
      timezone: values.timezone?.trim() || undefined,
    })

    toast.promise(promise, {
      loading: 'Saving notification preferences...',
      success: 'Notification preferences saved.',
      error: getApiErrorMessage,
    })

    await promise
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery preferences</CardTitle>
        <CardDescription>
          Preferences control which channels and categories can reach your
          account. Transactional messages are always allowed by the backend.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ApiQueryState
          emptyTitle='Preferences unavailable'
          emptyDescription='The backend did not return notification preferences.'
          error={preferencesQuery.error}
          hasData={Boolean(preferences)}
          isError={preferencesQuery.isError}
          isLoading={preferencesQuery.isLoading}
          loadingLabel='Loading preferences...'
          onRetry={() => void preferencesQuery.refetch()}
        >
          <Form {...form}>
            <form onSubmit={onSubmit} className='grid gap-5'>
              <div className='grid gap-3 sm:grid-cols-2'>
                {[
                  ['emailEnabled', 'Email'],
                  ['smsEnabled', 'SMS'],
                  ['pushEnabled', 'Push'],
                  ['miniAppEnabled', 'Mini app'],
                  ['marketingEnabled', 'Marketing'],
                  ['systemEnabled', 'System'],
                  ['digestEnabled', 'Digest'],
                ].map(([name, label]) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name as keyof z.input<typeof preferenceSchema>}
                    render={({ field }) => (
                      <FormItem className='flex items-center justify-between rounded-md border border-[var(--bdr)] p-3'>
                        <FormLabel>{label}</FormLabel>
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
                ))}
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='language'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isPending}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {NOTIFICATION_LANGUAGES.map((language) => (
                            <SelectItem key={language} value={language}>
                              {language}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='timezone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timezone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Asia/Tehran'
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='quietHoursStart'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quiet hours start minute</FormLabel>
                      <FormControl>
                        <Input
                          inputMode='numeric'
                          placeholder='0-1439'
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='quietHoursEnd'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quiet hours end minute</FormLabel>
                      <FormControl>
                        <Input
                          inputMode='numeric'
                          placeholder='0-1439'
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {preferences && (
                <p className='text-sm text-muted-foreground'>
                  Current quiet window:{' '}
                  {formatQuietHour(preferences.quietHoursStart) || 'none'} -{' '}
                  {formatQuietHour(preferences.quietHoursEnd) || 'none'}
                </p>
              )}

              <div className='flex justify-end'>
                <Button type='submit' disabled={isPending}>
                  {isPending ? (
                    <Loader2 className='size-4 animate-spin' />
                  ) : (
                    <Save className='size-4' />
                  )}
                  Save preferences
                </Button>
              </div>
            </form>
          </Form>
        </ApiQueryState>
      </CardContent>
    </Card>
  )
}

export function NotificationTemplatesPanel({ enabled }: { enabled: boolean }) {
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] =
    useState<NotificationTemplate | null>(null)
  const templatesQuery = useNotificationTemplates(enabled)
  const templates = filterTemplates(getTemplates(templatesQuery.data), search)

  if (!enabled) {
    return (
      <ApiEmpty
        title='Template management unavailable'
        description='Your account is missing the notification template management capability.'
      />
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <div>
              <CardTitle>Notification templates</CardTitle>
              <CardDescription>
                Manage backend-rendered template keys, channels, languages, and
                active state.
              </CardDescription>
            </div>
            <Button
              type='button'
              onClick={() => {
                setSelectedTemplate(null)
                setDialogOpen(true)
              }}
            >
              <Plus className='size-4' />
              New template
            </Button>
          </div>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <div className='grid gap-2 sm:max-w-sm'>
            <Label htmlFor='notification-template-search'>
              Search templates
            </Label>
            <Input
              id='notification-template-search'
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder='Template key, channel, language'
            />
          </div>

          <ApiQueryState
            emptyTitle='No templates'
            emptyDescription='Create the first backend notification template.'
            error={templatesQuery.error}
            hasData={templates.length > 0}
            isError={templatesQuery.isError}
            isLoading={templatesQuery.isLoading}
            loadingLabel='Loading templates...'
            onRetry={() => void templatesQuery.refetch()}
          >
            <div className='overflow-hidden rounded-md border border-[var(--bdr)]'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>
                        <div className='font-medium'>{template.key}</div>
                        <div className='max-w-[320px] truncate text-xs text-muted-foreground'>
                          {template.subject || template.body}
                        </div>
                      </TableCell>
                      <TableCell>{template.channel}</TableCell>
                      <TableCell>{template.language}</TableCell>
                      <TableCell>
                        <StatusPill tone={template.isActive ? 'ok' : 'neutral'}>
                          {template.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </StatusPill>
                      </TableCell>
                      <TableCell className='text-right'>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() => {
                            setSelectedTemplate(template)
                            setDialogOpen(true)
                          }}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ApiQueryState>
        </CardContent>
      </Card>

      <NotificationTemplateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        template={selectedTemplate}
      />
    </>
  )
}

function NotificationTemplateDialog({
  onOpenChange,
  open,
  template,
}: NotificationTemplateDialogProps) {
  const createMutation = useCreateNotificationTemplate()
  const updateMutation = useUpdateNotificationTemplate()
  const isEdit = Boolean(template)
  const isPending = createMutation.isPending || updateMutation.isPending
  const { form, handleApiSubmit } = useApiForm<z.input<typeof templateSchema>>({
    defaultValues: {
      body: '',
      channel: 'EMAIL',
      isActive: true,
      key: '',
      language: 'en_US',
      subject: '',
    },
    resolver: zodResolver(templateSchema),
    values: template
      ? {
          body: template.body,
          channel: template.channel,
          isActive: template.isActive,
          key: template.key,
          language: template.language,
          subject: template.subject ?? '',
        }
      : undefined,
  })

  const onSubmit = handleApiSubmit(async (values) => {
    const body = {
      body: values.body,
      subject: values.subject?.trim() || undefined,
    }
    const promise =
      template && isEdit
        ? updateMutation.mutateAsync({
            body: { ...body, isActive: values.isActive },
            id: template.id,
          })
        : createMutation.mutateAsync({
            ...body,
            channel: values.channel,
            key: values.key,
            language: values.language,
          })

    toast.promise(promise, {
      loading: isEdit ? 'Updating template...' : 'Creating template...',
      success: isEdit ? 'Template updated.' : 'Template created.',
      error: getApiErrorMessage,
    })

    await promise
    form.reset()
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit template' : 'Create template'}
          </DialogTitle>
          <DialogDescription>
            Templates render server-side with double-brace variables such as
            {' {{name}}'}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='notification-template-form'
            onSubmit={onSubmit}
            className='grid gap-4'
          >
            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='key'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template key</FormLabel>
                    <FormControl>
                      <Input disabled={isPending || isEdit} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='subject'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='channel'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending || isEdit}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {NOTIFICATION_CHANNELS.map((channel) => (
                          <SelectItem key={channel} value={channel}>
                            {channel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='language'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending || isEdit}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {NOTIFICATION_LANGUAGES.map((language) => (
                          <SelectItem key={language} value={language}>
                            {language}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {isEdit && (
              <FormField
                control={form.control}
                name='isActive'
                render={({ field }) => (
                  <FormItem className='flex items-center justify-between rounded-md border border-[var(--bdr)] p-3'>
                    <FormLabel>Active</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        disabled={isPending}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name='body'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body</FormLabel>
                  <FormControl>
                    <Textarea disabled={isPending} rows={8} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button
            type='submit'
            form='notification-template-form'
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <Save className='size-4' />
            )}
            {isEdit ? 'Save template' : 'Create template'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function NotificationDispatchPanel({ enabled }: { enabled: boolean }) {
  const sendMutation = useSendNotification()
  const isPending = sendMutation.isPending
  const { form, handleApiSubmit } = useApiForm<z.input<typeof dispatchSchema>>({
    defaultValues: {
      category: 'SYSTEM',
      templateKey: '',
      userId: '',
      variables: '{}',
    },
    resolver: zodResolver(dispatchSchema),
  })

  if (!enabled) {
    return (
      <ApiEmpty
        title='Dispatch unavailable'
        description='Your account is missing the notification send capability.'
      />
    )
  }

  const onSubmit = handleApiSubmit(async (values) => {
    const variables = parseVariablesJson(values.variables)
    const promise = sendMutation.mutateAsync({
      category: values.category,
      templateKey: values.templateKey,
      userId: values.userId,
      variables,
    })

    toast.promise(promise, {
      loading: 'Dispatching notification...',
      success: (notification) =>
        notification
          ? 'Notification queued for delivery.'
          : 'Dispatch completed without a delivery target.',
      error: getApiErrorMessage,
    })

    await promise
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dispatch notification</CardTitle>
        <CardDescription>
          Send a rendered template to a single backend user. Delivery still
          follows preferences and channel targeting rules.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className='grid gap-4'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='userId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User ID</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='templateKey'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template key</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {NOTIFICATION_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='variables'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variables JSON</FormLabel>
                  <FormControl>
                    <Textarea disabled={isPending} rows={8} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-end'>
              <Button type='submit' disabled={isPending}>
                {isPending ? (
                  <Loader2 className='size-4 animate-spin' />
                ) : (
                  <Send className='size-4' />
                )}
                Dispatch
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export function NotificationOperationsPanel({ enabled }: { enabled: boolean }) {
  const [processOpen, setProcessOpen] = useState(false)
  const [retryOpen, setRetryOpen] = useState(false)
  const processMutation = useProcessNotificationDeliveries()
  const retryMutation = useRetryNotificationDeadLetters()
  const [lastResult, setLastResult] = useState<string | null>(null)

  if (!enabled) {
    return (
      <ApiEmpty
        title='Delivery operations unavailable'
        description='Your account is missing the notification delivery management capability.'
      />
    )
  }

  async function processDueDeliveries() {
    const promise = processMutation.mutateAsync()
    toast.promise(promise, {
      loading: 'Processing due deliveries...',
      success: (result) => `Processed ${result.affected} deliveries.`,
      error: getApiErrorMessage,
    })
    const result = await promise
    setLastResult(`Processed ${result.affected} due deliveries.`)
    setProcessOpen(false)
  }

  async function retryDeadLetters() {
    const promise = retryMutation.mutateAsync()
    toast.promise(promise, {
      loading: 'Retrying dead letters...',
      success: (result) => `Requeued ${result.affected} deliveries.`,
      error: getApiErrorMessage,
    })
    const result = await promise
    setLastResult(`Requeued ${result.affected} dead-letter deliveries.`)
    setRetryOpen(false)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Delivery operations</CardTitle>
          <CardDescription>
            Run manual backend maintenance for due deliveries and dead-letter
            retries.
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <div className='grid gap-3 sm:grid-cols-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setProcessOpen(true)}
            >
              <Play className='size-4' />
              Process due deliveries
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={() => setRetryOpen(true)}
            >
              <RefreshCw className='size-4' />
              Retry dead letters
            </Button>
          </div>
          {lastResult && (
            <div className='rounded-md border border-[var(--bdr)] bg-[var(--sur)] p-3 text-sm text-muted-foreground'>
              {lastResult}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={processOpen}
        onOpenChange={setProcessOpen}
        title='Process due deliveries?'
        desc='The backend will attempt delivery for all due queued notifications.'
        confirmText={
          <>
            <SlidersHorizontal className='size-4' />
            Process
          </>
        }
        isLoading={processMutation.isPending}
        handleConfirm={() => void processDueDeliveries()}
      />
      <ConfirmDialog
        open={retryOpen}
        onOpenChange={setRetryOpen}
        title='Retry dead letters?'
        desc='The backend will requeue dead-letter deliveries according to its retry policy.'
        confirmText={
          <>
            <RefreshCw className='size-4' />
            Retry
          </>
        }
        isLoading={retryMutation.isPending}
        handleConfirm={() => void retryDeadLetters()}
      />
    </>
  )
}
