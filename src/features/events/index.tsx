import { useMemo, useState } from 'react'
import { MapPin, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ApiEmpty, ApiError, ApiLoading } from '@/components/api'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { SelectDropdown } from '@/components/select-dropdown'
import { CreateEventDialog } from './components/create-event-dialog'
import { CreateVenueDialog } from './components/create-venue-dialog'
import { EventDetailDialog } from './components/event-detail-dialog'
import { EventsTable } from './components/events-table'
import { RsvpsTable } from './components/rsvps-table'
import { VenuesTable } from './components/venues-table'
import {
  useCancelEvent,
  useMyEventRsvps,
  useMyEvents,
  usePublishedEvents,
  usePublishEvent,
  useSubmitEventRsvp,
  useVenues,
} from './hooks/use-events-queries'
import {
  EVENT_STATUS_OPTIONS,
  EVENT_TYPE_OPTIONS,
  filterEvents,
} from './services/events-query'
import type {
  Event,
  EventStatusValue,
  EventTypeValue,
  RsvpStatusValue,
} from './types'

const ALL_STATUS_OPTIONS = [
  { label: 'All statuses', value: 'all' },
  ...EVENT_STATUS_OPTIONS,
]

const ALL_TYPE_OPTIONS = [
  { label: 'All types', value: 'all' },
  ...EVENT_TYPE_OPTIONS,
]

export function Events() {
  const [detailEvent, setDetailEvent] = useState<Event | null>(null)
  const [detailMode, setDetailMode] = useState<'public' | 'organizer'>('public')
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false)
  const [isCreateVenueOpen, setIsCreateVenueOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<EventStatusValue | 'all'>('all')
  const [type, setType] = useState<EventTypeValue | 'all'>('all')

  const publishedQuery = usePublishedEvents()
  const mineQuery = useMyEvents()
  const rsvpsQuery = useMyEventRsvps()
  const venuesQuery = useVenues()
  const publishMutation = usePublishEvent()
  const cancelMutation = useCancelEvent()
  const rsvpMutation = useSubmitEventRsvp()

  const venues = venuesQuery.data ?? []
  const publishedEvents = useMemo(
    () =>
      filterEvents(publishedQuery.data ?? [], {
        query,
        status,
        type,
      }),
    [publishedQuery.data, query, status, type]
  )
  const organizedEvents = useMemo(
    () =>
      filterEvents(mineQuery.data ?? [], {
        query,
        status,
        type,
      }),
    [mineQuery.data, query, status, type]
  )

  const openDetails = (event: Event, mode: 'public' | 'organizer') => {
    setDetailEvent(event)
    setDetailMode(mode)
  }

  const publishEvent = async (event: Event) => {
    await publishMutation.mutateAsync(event.id)
  }

  const cancelEvent = async (event: Event) => {
    await cancelMutation.mutateAsync(event.id)
  }

  const submitRsvp = async (event: Event, nextStatus: RsvpStatusValue) => {
    await rsvpMutation.mutateAsync({ eventId: event.id, status: nextStatus })
  }

  return (
    <>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Events</h2>
            <p className='text-muted-foreground'>
              Manage organized events, venues, discovery, and RSVPs.
            </p>
          </div>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              onClick={() => setIsCreateVenueOpen(true)}
            >
              <MapPin className='size-4' />
              New venue
            </Button>
            <Button onClick={() => setIsCreateEventOpen(true)}>
              <Plus className='size-4' />
              New event
            </Button>
          </div>
        </div>

        <div className='grid gap-3 md:grid-cols-[1fr_180px_180px]'>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='Search events...'
          />
          <SelectDropdown
            defaultValue={status}
            isControlled
            items={ALL_STATUS_OPTIONS}
            onValueChange={(value) =>
              setStatus(value as EventStatusValue | 'all')
            }
          />
          <SelectDropdown
            defaultValue={type}
            isControlled
            items={ALL_TYPE_OPTIONS}
            onValueChange={(value) => setType(value as EventTypeValue | 'all')}
          />
        </div>

        <Tabs defaultValue='discovery' className='w-full'>
          <TabsList className='flex-wrap'>
            <TabsTrigger value='discovery'>Discovery</TabsTrigger>
            <TabsTrigger value='organized'>Organized</TabsTrigger>
            <TabsTrigger value='rsvps'>RSVPs</TabsTrigger>
            <TabsTrigger value='venues'>Venues</TabsTrigger>
          </TabsList>

          <TabsContent value='discovery' className='mt-4'>
            {publishedQuery.isLoading && (
              <ApiLoading label='Loading published events...' />
            )}
            {publishedQuery.isError && (
              <ApiError
                error={publishedQuery.error}
                onRetry={() => void publishedQuery.refetch()}
              />
            )}
            {!publishedQuery.isLoading &&
              !publishedQuery.isError &&
              publishedEvents.length === 0 && (
                <ApiEmpty
                  title='No published events'
                  description='No published events match the current filters.'
                />
              )}
            {!publishedQuery.isLoading &&
              !publishedQuery.isError &&
              publishedEvents.length > 0 && (
                <EventsTable
                  events={publishedEvents}
                  mode='discovery'
                  onOpenDetails={(event) => openDetails(event, 'public')}
                  onRsvp={submitRsvp}
                  rsvps={rsvpsQuery.data ?? []}
                  venues={venues}
                />
              )}
          </TabsContent>

          <TabsContent value='organized' className='mt-4'>
            {mineQuery.isLoading && (
              <ApiLoading label='Loading organized events...' />
            )}
            {mineQuery.isError && (
              <ApiError
                error={mineQuery.error}
                onRetry={() => void mineQuery.refetch()}
              />
            )}
            {!mineQuery.isLoading &&
              !mineQuery.isError &&
              organizedEvents.length === 0 && (
                <ApiEmpty
                  title='No organized events'
                  description='No organized events match the current filters.'
                />
              )}
            {!mineQuery.isLoading &&
              !mineQuery.isError &&
              organizedEvents.length > 0 && (
                <EventsTable
                  events={organizedEvents}
                  mode='organizer'
                  onCancel={cancelEvent}
                  onOpenDetails={(event) => openDetails(event, 'organizer')}
                  onPublish={publishEvent}
                  venues={venues}
                />
              )}
          </TabsContent>

          <TabsContent value='rsvps' className='mt-4'>
            {rsvpsQuery.isLoading && <ApiLoading label='Loading RSVPs...' />}
            {rsvpsQuery.isError && (
              <ApiError
                error={rsvpsQuery.error}
                onRetry={() => void rsvpsQuery.refetch()}
              />
            )}
            {!rsvpsQuery.isLoading &&
              !rsvpsQuery.isError &&
              (rsvpsQuery.data?.length ?? 0) === 0 && (
                <ApiEmpty
                  title='No RSVPs'
                  description='The backend returned no RSVPs for this account.'
                />
              )}
            {!rsvpsQuery.isLoading &&
              !rsvpsQuery.isError &&
              (rsvpsQuery.data?.length ?? 0) > 0 && (
                <RsvpsTable
                  events={publishedQuery.data ?? []}
                  rsvps={rsvpsQuery.data ?? []}
                />
              )}
          </TabsContent>

          <TabsContent value='venues' className='mt-4'>
            {venuesQuery.isLoading && <ApiLoading label='Loading venues...' />}
            {venuesQuery.isError && (
              <ApiError
                error={venuesQuery.error}
                onRetry={() => void venuesQuery.refetch()}
              />
            )}
            {!venuesQuery.isLoading &&
              !venuesQuery.isError &&
              venues.length === 0 && (
                <ApiEmpty
                  title='No venues'
                  description='Create a venue to attach it to organized events.'
                />
              )}
            {!venuesQuery.isLoading &&
              !venuesQuery.isError &&
              venues.length > 0 && <VenuesTable venues={venues} />}
          </TabsContent>
        </Tabs>
      </Main>

      <CreateEventDialog
        open={isCreateEventOpen}
        onOpenChange={setIsCreateEventOpen}
        venues={venues}
      />
      <CreateVenueDialog
        open={isCreateVenueOpen}
        onOpenChange={setIsCreateVenueOpen}
      />
      <EventDetailDialog
        event={detailEvent}
        mode={detailMode}
        onOpenChange={(open) => {
          if (!open) setDetailEvent(null)
        }}
        open={Boolean(detailEvent)}
        venues={venues}
      />
    </>
  )
}
