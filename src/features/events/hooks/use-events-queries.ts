import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  eventControllerAttendees,
  eventControllerCancel,
  eventControllerCreate,
  eventControllerGet,
  eventControllerList,
  eventControllerListMine,
  eventControllerMyRsvps,
  eventControllerPublish,
  eventControllerRsvp,
  venueControllerCreate,
  venueControllerList,
} from '@/lib/api/generated/endpoints/events/events'
import type {
  CreateEventRequest,
  CreateVenueRequest,
  RsvpStatusValue,
} from '../types'

export const eventsQueryKeys = {
  all: ['events'] as const,
  attendees: (id: string) => ['events', 'attendees', id] as const,
  catalog: () => ['events', 'catalog'] as const,
  detail: (id: string) => ['events', 'detail', id] as const,
  mine: () => ['events', 'mine'] as const,
  rsvps: () => ['events', 'rsvps', 'mine'] as const,
  venues: () => ['events', 'venues'] as const,
}

export function usePublishedEvents() {
  return useQuery({
    queryFn: ({ signal }) => eventControllerList(undefined, signal),
    queryKey: eventsQueryKeys.catalog(),
  })
}

export function useMyEvents() {
  return useQuery({
    queryFn: ({ signal }) => eventControllerListMine(undefined, signal),
    queryKey: eventsQueryKeys.mine(),
  })
}

export function useMyEventRsvps() {
  return useQuery({
    queryFn: ({ signal }) => eventControllerMyRsvps(undefined, signal),
    queryKey: eventsQueryKeys.rsvps(),
  })
}

export function useVenues() {
  return useQuery({
    queryFn: ({ signal }) => venueControllerList(undefined, signal),
    queryKey: eventsQueryKeys.venues(),
  })
}

export function usePublicEvent(id: string | null, enabled: boolean) {
  return useQuery({
    enabled: enabled && Boolean(id),
    queryFn: ({ signal }) => eventControllerGet(id ?? '', undefined, signal),
    queryKey: eventsQueryKeys.detail(id ?? 'none'),
  })
}

export function useEventAttendees(id: string | null, enabled: boolean) {
  return useQuery({
    enabled: enabled && Boolean(id),
    queryFn: ({ signal }) =>
      eventControllerAttendees(id ?? '', undefined, signal),
    queryKey: eventsQueryKeys.attendees(id ?? 'none'),
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: CreateEventRequest) =>
      eventControllerCreate(variables),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: eventsQueryKeys.mine() }),
        queryClient.invalidateQueries({ queryKey: eventsQueryKeys.catalog() }),
      ])
    },
  })
}

export function useCreateVenue() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: CreateVenueRequest) =>
      venueControllerCreate(variables),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: eventsQueryKeys.venues(),
      })
    },
  })
}

export function usePublishEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => eventControllerPublish(id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: eventsQueryKeys.mine() }),
        queryClient.invalidateQueries({ queryKey: eventsQueryKeys.catalog() }),
      ])
    },
  })
}

export function useCancelEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => eventControllerCancel(id),
    onSuccess: async (_event, id) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: eventsQueryKeys.mine() }),
        queryClient.invalidateQueries({ queryKey: eventsQueryKeys.catalog() }),
        queryClient.invalidateQueries({
          queryKey: eventsQueryKeys.attendees(id),
        }),
      ])
    },
  })
}

export function useSubmitEventRsvp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      eventId,
      status,
    }: {
      eventId: string
      status: RsvpStatusValue
    }) => eventControllerRsvp(eventId, { status }),
    onSuccess: async (_rsvp, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: eventsQueryKeys.rsvps() }),
        queryClient.invalidateQueries({
          queryKey: eventsQueryKeys.attendees(variables.eventId),
        }),
      ])
    },
  })
}
