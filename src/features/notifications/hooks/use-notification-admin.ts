import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  notificationAdminControllerProcess,
  notificationAdminControllerRetryDeadLetters,
  notificationControllerGet,
  notificationControllerSend,
  preferenceControllerGet,
  preferenceControllerUpdate,
  templateControllerCreate,
  templateControllerList,
  templateControllerUpdate,
} from '@/lib/api/generated/endpoints/notifications/notifications'
import type {
  CreateTemplateDto,
  NotificationDto,
  PreferenceDto,
  SendNotificationDto,
  TemplateDto,
  UpdatePreferenceDto,
  UpdateTemplateDto,
} from '@/lib/api/generated/model'

export const notificationQueryKeys = {
  all: ['notifications'] as const,
  detail: (id: string | null) => [...notificationQueryKeys.all, 'detail', id],
  preferences: () => [...notificationQueryKeys.all, 'preferences'] as const,
  templates: () => [...notificationQueryKeys.all, 'templates'] as const,
}

export function useNotificationDetail(id: string | null) {
  return useQuery({
    enabled: Boolean(id),
    queryFn: ({ signal }) =>
      notificationControllerGet(id ?? '', undefined, signal),
    queryKey: notificationQueryKeys.detail(id),
  })
}

export function useNotificationPreferences() {
  return useQuery({
    queryFn: ({ signal }) => preferenceControllerGet(undefined, signal),
    queryKey: notificationQueryKeys.preferences(),
  })
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: UpdatePreferenceDto) => preferenceControllerUpdate(body),
    onSuccess: (preferences: PreferenceDto) => {
      queryClient.setQueryData(notificationQueryKeys.preferences(), preferences)
    },
  })
}

export function useNotificationTemplates(enabled: boolean) {
  return useQuery({
    enabled,
    queryFn: ({ signal }) => templateControllerList(undefined, signal),
    queryKey: notificationQueryKeys.templates(),
  })
}

export function useCreateNotificationTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateTemplateDto) => templateControllerCreate(body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.templates(),
      })
    },
  })
}

export function useUpdateNotificationTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      body: UpdateTemplateDto
      id: TemplateDto['id']
    }) => templateControllerUpdate(id, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.templates(),
      })
    },
  })
}

export function useSendNotification() {
  return useMutation({
    mutationFn: (body: SendNotificationDto): Promise<NotificationDto | null> =>
      notificationControllerSend(body) as Promise<NotificationDto | null>,
  })
}

export function useProcessNotificationDeliveries() {
  return useMutation({
    mutationFn: () => notificationAdminControllerProcess(),
  })
}

export function useRetryNotificationDeadLetters() {
  return useMutation({
    mutationFn: () => notificationAdminControllerRetryDeadLetters(),
  })
}
