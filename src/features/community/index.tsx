import { useMemo, useState, type FormEventHandler } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CalendarPlus,
  Loader2,
  MessageSquarePlus,
  Plus,
  Send,
  Trash2,
  UserPlus,
} from 'lucide-react'
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
import { ApiEmpty, ApiError, ApiLoading } from '@/components/api'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { StatusPill } from '@/components/status-pill'
import {
  useAcceptGroupInvitation,
  useCreateGroup,
  useDeclineGroupInvitation,
  useDisbandGroup,
  useGroupInvitations,
  useGroupMembers,
  useInviteGroupMember,
  useLeaveGroup,
  useMyCollaborations,
  useMyCommunitySessions,
  useMyGroups,
  useRemoveGroupMember,
  useScheduleCommunitySession,
  useStartCollaboration,
} from './hooks/use-community-queries'
import {
  filterCollaborations,
  filterGroups,
  filterSessions,
  formatCommunityDate,
  getCollaborationTone,
  getInvitationTone,
  getMemberTone,
  parseParticipantIds,
} from './services/community-query'
import type {
  CommunityCollaboration,
  CommunityGroup,
  CommunityInvitation,
  CommunityMember,
  CommunitySession,
} from './types'

const groupSchema = z.object({
  bio: z.string().trim().max(500).optional(),
  name: z.string().trim().min(2).max(120),
})

const inviteSchema = z.object({
  groupId: z.string().uuid(),
  invitedUserId: z.string().uuid(),
})

const collaborationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  participantIds: z.string(),
})

const sessionSchema = z.object({
  isOnline: z.boolean(),
  location: z.string().trim().max(240).optional(),
  participantIds: z.string(),
  scheduledAt: z.string().min(1),
  title: z.string().trim().min(2).max(120),
})

export function Community() {
  const [query, setQuery] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<CommunityGroup | null>(
    null
  )
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [isCollaborationOpen, setIsCollaborationOpen] = useState(false)
  const [isSessionOpen, setIsSessionOpen] = useState(false)
  const [pendingGroupAction, setPendingGroupAction] = useState<{
    group: CommunityGroup
    type: 'disband' | 'leave'
  } | null>(null)
  const [pendingMemberRemoval, setPendingMemberRemoval] =
    useState<CommunityMember | null>(null)

  const groupsQuery = useMyGroups()
  const invitationsQuery = useGroupInvitations()
  const collaborationsQuery = useMyCollaborations()
  const sessionsQuery = useMyCommunitySessions()
  const membersQuery = useGroupMembers(selectedGroup?.id ?? null)
  const leaveMutation = useLeaveGroup()
  const disbandMutation = useDisbandGroup()
  const removeMemberMutation = useRemoveGroupMember()

  const filteredGroups = useMemo(
    () => filterGroups(groupsQuery.data ?? [], query),
    [groupsQuery.data, query]
  )
  const collaborations = useMemo(
    () => filterCollaborations(collaborationsQuery.data ?? [], query),
    [collaborationsQuery.data, query]
  )
  const sessions = useMemo(
    () => filterSessions(sessionsQuery.data ?? [], query),
    [sessionsQuery.data, query]
  )

  async function handleGroupAction() {
    if (!pendingGroupAction) return

    const promise =
      pendingGroupAction.type === 'leave'
        ? leaveMutation.mutateAsync(pendingGroupAction.group.id)
        : disbandMutation.mutateAsync(pendingGroupAction.group.id)
    toast.promise(promise, {
      loading:
        pendingGroupAction.type === 'leave'
          ? 'Leaving group...'
          : 'Disbanding group...',
      success:
        pendingGroupAction.type === 'leave'
          ? 'Group left.'
          : 'Group disbanded.',
      error: getApiErrorMessage,
    })
    await promise
    setPendingGroupAction(null)
    setSelectedGroup(null)
  }

  async function removeMember() {
    if (!selectedGroup || !pendingMemberRemoval) return

    const promise = removeMemberMutation.mutateAsync({
      groupId: selectedGroup.id,
      userId: pendingMemberRemoval.userId,
    })
    toast.promise(promise, {
      loading: 'Removing member...',
      success: 'Member removed.',
      error: getApiErrorMessage,
    })
    await promise
    setPendingMemberRemoval(null)
  }

  return (
    <>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Community</h2>
            <p className='text-muted-foreground'>
              Manage groups, invitations, collaborations, and scheduled
              community sessions.
            </p>
          </div>
          <div className='flex flex-wrap gap-2'>
            <Button variant='outline' onClick={() => setIsSessionOpen(true)}>
              <CalendarPlus className='size-4' />
              Schedule session
            </Button>
            <Button
              variant='outline'
              onClick={() => setIsCollaborationOpen(true)}
            >
              <MessageSquarePlus className='size-4' />
              New collaboration
            </Button>
            <Button onClick={() => setIsCreateGroupOpen(true)}>
              <Plus className='size-4' />
              New group
            </Button>
          </div>
        </div>

        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder='Search community records...'
        />

        <Tabs defaultValue='groups' className='w-full'>
          <TabsList className='flex-wrap'>
            <TabsTrigger value='groups'>Groups</TabsTrigger>
            <TabsTrigger value='invitations'>Invitations</TabsTrigger>
            <TabsTrigger value='collaborations'>Collaborations</TabsTrigger>
            <TabsTrigger value='sessions'>Sessions</TabsTrigger>
          </TabsList>

          <TabsContent value='groups' className='mt-4'>
            <GroupsPanel
              groups={filteredGroups}
              isError={groupsQuery.isError}
              isLoading={groupsQuery.isLoading}
              error={groupsQuery.error}
              onRetry={() => void groupsQuery.refetch()}
              onInvite={(group) => {
                setSelectedGroup(group)
                setIsInviteOpen(true)
              }}
              onSelect={setSelectedGroup}
              onDisband={(group) =>
                setPendingGroupAction({ group, type: 'disband' })
              }
              onLeave={(group) =>
                setPendingGroupAction({ group, type: 'leave' })
              }
            />
          </TabsContent>

          <TabsContent value='invitations' className='mt-4'>
            <InvitationsPanel
              invitations={invitationsQuery.data ?? []}
              isError={invitationsQuery.isError}
              isLoading={invitationsQuery.isLoading}
              error={invitationsQuery.error}
              onRetry={() => void invitationsQuery.refetch()}
            />
          </TabsContent>

          <TabsContent value='collaborations' className='mt-4'>
            <CollaborationsPanel
              collaborations={collaborations}
              isError={collaborationsQuery.isError}
              isLoading={collaborationsQuery.isLoading}
              error={collaborationsQuery.error}
              onRetry={() => void collaborationsQuery.refetch()}
            />
          </TabsContent>

          <TabsContent value='sessions' className='mt-4'>
            <SessionsPanel
              sessions={sessions}
              isError={sessionsQuery.isError}
              isLoading={sessionsQuery.isLoading}
              error={sessionsQuery.error}
              onRetry={() => void sessionsQuery.refetch()}
            />
          </TabsContent>
        </Tabs>

        {selectedGroup && (
          <GroupMembersPanel
            group={selectedGroup}
            members={membersQuery.data ?? []}
            isError={membersQuery.isError}
            isLoading={membersQuery.isLoading}
            error={membersQuery.error}
            onRetry={() => void membersQuery.refetch()}
            onRemove={setPendingMemberRemoval}
          />
        )}
      </Main>

      <CreateGroupDialog
        open={isCreateGroupOpen}
        onOpenChange={setIsCreateGroupOpen}
      />
      <InviteMemberDialog
        group={selectedGroup}
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
      />
      <StartCollaborationDialog
        open={isCollaborationOpen}
        onOpenChange={setIsCollaborationOpen}
      />
      <ScheduleSessionDialog
        open={isSessionOpen}
        onOpenChange={setIsSessionOpen}
      />
      <ConfirmDialog
        open={Boolean(pendingGroupAction)}
        onOpenChange={(open) => {
          if (!open) setPendingGroupAction(null)
        }}
        title={
          pendingGroupAction?.type === 'leave'
            ? 'Leave group?'
            : 'Disband group?'
        }
        desc='This action will be sent to the backend community service.'
        destructive
        isLoading={leaveMutation.isPending || disbandMutation.isPending}
        handleConfirm={() => void handleGroupAction()}
      />
      <ConfirmDialog
        open={Boolean(pendingMemberRemoval)}
        onOpenChange={(open) => {
          if (!open) setPendingMemberRemoval(null)
        }}
        title='Remove member?'
        desc='The member will be removed from the selected group.'
        destructive
        isLoading={removeMemberMutation.isPending}
        handleConfirm={() => void removeMember()}
      />
    </>
  )
}

function GroupsPanel({
  groups,
  error,
  isError,
  isLoading,
  onDisband,
  onInvite,
  onLeave,
  onRetry,
  onSelect,
}: {
  error: unknown
  groups: CommunityGroup[]
  isError: boolean
  isLoading: boolean
  onDisband: (group: CommunityGroup) => void
  onInvite: (group: CommunityGroup) => void
  onLeave: (group: CommunityGroup) => void
  onRetry: () => void
  onSelect: (group: CommunityGroup) => void
}) {
  if (isLoading) return <ApiLoading label='Loading groups...' />
  if (isError) return <ApiError error={error} onRetry={onRetry} />
  if (groups.length === 0) {
    return (
      <ApiEmpty
        title='No groups'
        description='Create a group or adjust the current search.'
      />
    )
  }

  return (
    <div className='grid gap-3'>
      {groups.map((group) => (
        <div key={group.id} className='rounded-md border p-4'>
          <div className='flex flex-wrap items-start justify-between gap-3'>
            <div className='min-w-0'>
              <div className='font-medium'>{group.name}</div>
              <div className='text-sm text-muted-foreground'>
                {group.bio || 'No group bio'}
              </div>
              <div className='mt-1 text-xs text-muted-foreground'>
                Created {formatCommunityDate(group.createdAt)}
              </div>
            </div>
            <div className='flex flex-wrap gap-2'>
              <Button
                size='sm'
                variant='outline'
                onClick={() => onSelect(group)}
              >
                Members
              </Button>
              <Button
                size='sm'
                variant='outline'
                onClick={() => onInvite(group)}
              >
                <UserPlus className='size-4' />
                Invite
              </Button>
              <Button size='sm' variant='ghost' onClick={() => onLeave(group)}>
                Leave
              </Button>
              <Button
                size='icon'
                variant='ghost'
                onClick={() => onDisband(group)}
              >
                <Trash2 className='size-4' />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function InvitationsPanel({
  invitations,
  error,
  isError,
  isLoading,
  onRetry,
}: {
  error: unknown
  invitations: CommunityInvitation[]
  isError: boolean
  isLoading: boolean
  onRetry: () => void
}) {
  const acceptMutation = useAcceptGroupInvitation()
  const declineMutation = useDeclineGroupInvitation()

  async function act(
    invitation: CommunityInvitation,
    action: 'accept' | 'decline'
  ) {
    const promise =
      action === 'accept'
        ? acceptMutation.mutateAsync(invitation.id).then(() => undefined)
        : declineMutation.mutateAsync(invitation.id)
    toast.promise(promise, {
      loading:
        action === 'accept'
          ? 'Accepting invitation...'
          : 'Declining invitation...',
      success:
        action === 'accept' ? 'Invitation accepted.' : 'Invitation declined.',
      error: getApiErrorMessage,
    })
    await promise
  }

  if (isLoading) return <ApiLoading label='Loading invitations...' />
  if (isError) return <ApiError error={error} onRetry={onRetry} />
  if (invitations.length === 0) {
    return (
      <ApiEmpty
        title='No pending invitations'
        description='The backend returned no group invitations for this account.'
      />
    )
  }

  return (
    <div className='grid gap-3'>
      {invitations.map((invitation) => (
        <div
          key={invitation.id}
          className='flex flex-wrap items-center justify-between gap-3 rounded-md border p-4'
        >
          <div className='min-w-0'>
            <div className='font-medium'>Group {invitation.groupId}</div>
            <div className='text-sm text-muted-foreground'>
              Invited user {invitation.invitedUserId}
            </div>
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <StatusPill tone={getInvitationTone(invitation.status)}>
              {invitation.status}
            </StatusPill>
            <Button
              size='sm'
              onClick={() => void act(invitation, 'accept')}
              disabled={
                acceptMutation.isPending || invitation.status !== 'PENDING'
              }
            >
              Accept
            </Button>
            <Button
              size='sm'
              variant='outline'
              onClick={() => void act(invitation, 'decline')}
              disabled={
                declineMutation.isPending || invitation.status !== 'PENDING'
              }
            >
              Decline
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

function CollaborationsPanel({
  collaborations,
  error,
  isError,
  isLoading,
  onRetry,
}: {
  collaborations: CommunityCollaboration[]
  error: unknown
  isError: boolean
  isLoading: boolean
  onRetry: () => void
}) {
  if (isLoading) return <ApiLoading label='Loading collaborations...' />
  if (isError) return <ApiError error={error} onRetry={onRetry} />
  if (collaborations.length === 0) {
    return (
      <ApiEmpty
        title='No collaborations'
        description='Start a collaboration or adjust the current search.'
      />
    )
  }

  return (
    <div className='grid gap-3'>
      {collaborations.map((collaboration) => (
        <div key={collaboration.id} className='rounded-md border p-4'>
          <div className='flex flex-wrap items-start justify-between gap-3'>
            <div className='min-w-0'>
              <div className='font-medium'>{collaboration.name}</div>
              <div className='text-sm text-muted-foreground'>
                {collaboration.participantIds.length} participants
              </div>
            </div>
            <StatusPill tone={getCollaborationTone(collaboration.status)}>
              {collaboration.status}
            </StatusPill>
          </div>
        </div>
      ))}
    </div>
  )
}

function SessionsPanel({
  error,
  isError,
  isLoading,
  onRetry,
  sessions,
}: {
  error: unknown
  isError: boolean
  isLoading: boolean
  onRetry: () => void
  sessions: CommunitySession[]
}) {
  if (isLoading) return <ApiLoading label='Loading community sessions...' />
  if (isError) return <ApiError error={error} onRetry={onRetry} />
  if (sessions.length === 0) {
    return (
      <ApiEmpty
        title='No community sessions'
        description='Schedule a session or adjust the current search.'
      />
    )
  }

  return (
    <div className='grid gap-3'>
      {sessions.map((session) => (
        <div key={session.id} className='rounded-md border p-4'>
          <div className='flex flex-wrap items-start justify-between gap-3'>
            <div className='min-w-0'>
              <div className='font-medium'>{session.title}</div>
              <div className='text-sm text-muted-foreground'>
                {formatCommunityDate(session.scheduledAt)}
              </div>
              <div className='text-xs text-muted-foreground'>
                {session.isOnline
                  ? 'Online'
                  : session.location || 'No location'}
              </div>
            </div>
            <StatusPill tone={session.isOnline ? 'info' : 'neutral'}>
              {session.isOnline ? 'ONLINE' : 'IN PERSON'}
            </StatusPill>
          </div>
        </div>
      ))}
    </div>
  )
}

function GroupMembersPanel({
  error,
  group,
  isError,
  isLoading,
  members,
  onRemove,
  onRetry,
}: {
  error: unknown
  group: CommunityGroup
  isError: boolean
  isLoading: boolean
  members: CommunityMember[]
  onRemove: (member: CommunityMember) => void
  onRetry: () => void
}) {
  return (
    <section className='grid gap-3'>
      <h3 className='text-lg font-semibold'>{group.name} members</h3>
      {isLoading && <ApiLoading label='Loading group members...' />}
      {isError && <ApiError error={error} onRetry={onRetry} />}
      {!isLoading && !isError && members.length === 0 && (
        <ApiEmpty
          title='No members'
          description='The backend returned no members for this group.'
        />
      )}
      {!isLoading && !isError && members.length > 0 && (
        <div className='grid gap-2'>
          {members.map((member) => (
            <div
              key={member.id}
              className='flex flex-wrap items-center justify-between gap-3 rounded-md border p-3'
            >
              <div>
                <div className='font-medium'>{member.userId}</div>
                <div className='text-sm text-muted-foreground'>
                  {member.role}
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <StatusPill tone={getMemberTone(member.status)}>
                  {member.status}
                </StatusPill>
                <Button
                  type='button'
                  size='icon'
                  variant='ghost'
                  onClick={() => onRemove(member)}
                >
                  <Trash2 className='size-4' />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function CreateGroupDialog({
  onOpenChange,
  open,
}: {
  onOpenChange: (open: boolean) => void
  open: boolean
}) {
  const mutation = useCreateGroup()
  const { form, handleApiSubmit } = useApiForm<z.input<typeof groupSchema>>({
    defaultValues: { bio: '', name: '' },
    resolver: zodResolver(groupSchema),
  })
  const onSubmit = handleApiSubmit(async (values) => {
    const promise = mutation.mutateAsync({
      bio: values.bio?.trim() || undefined,
      name: values.name.trim(),
    })
    toast.promise(promise, {
      loading: 'Creating group...',
      success: 'Group created.',
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
          <DialogTitle>Create group</DialogTitle>
          <DialogDescription>
            Create a current-user community group.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='create-group-form'
            onSubmit={onSubmit}
            className='grid gap-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='bio'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            form='create-group-form'
            type='submit'
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <Plus className='size-4' />
            )}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function InviteMemberDialog({
  group,
  onOpenChange,
  open,
}: {
  group: CommunityGroup | null
  onOpenChange: (open: boolean) => void
  open: boolean
}) {
  const mutation = useInviteGroupMember()
  const { form, handleApiSubmit } = useApiForm<z.input<typeof inviteSchema>>({
    defaultValues: { groupId: group?.id ?? '', invitedUserId: '' },
    resolver: zodResolver(inviteSchema),
    values: { groupId: group?.id ?? '', invitedUserId: '' },
  })
  const onSubmit = handleApiSubmit(async (values) => {
    const promise = mutation.mutateAsync({
      body: { invitedUserId: values.invitedUserId },
      groupId: values.groupId,
    })
    toast.promise(promise, {
      loading: 'Sending invitation...',
      success: 'Invitation sent.',
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
          <DialogTitle>Invite member</DialogTitle>
          <DialogDescription>
            Invite a user UUID to the selected group.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='invite-member-form'
            onSubmit={onSubmit}
            className='grid gap-4'
          >
            <FormField
              control={form.control}
              name='groupId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group ID</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='invitedUserId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            form='invite-member-form'
            type='submit'
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <Send className='size-4' />
            )}
            Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function StartCollaborationDialog({
  onOpenChange,
  open,
}: {
  onOpenChange: (open: boolean) => void
  open: boolean
}) {
  const mutation = useStartCollaboration()
  const { form, handleApiSubmit } = useApiForm<
    z.input<typeof collaborationSchema>
  >({
    defaultValues: { name: '', participantIds: '' },
    resolver: zodResolver(collaborationSchema),
  })
  const onSubmit = handleApiSubmit(async (values) => {
    const promise = mutation.mutateAsync({
      name: values.name.trim(),
      participantIds: parseParticipantIds(values.participantIds),
    })
    toast.promise(promise, {
      loading: 'Starting collaboration...',
      success: 'Collaboration started.',
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
          <DialogTitle>Start collaboration</DialogTitle>
          <DialogDescription>
            Start a collaboration with optional participant UUIDs.
          </DialogDescription>
        </DialogHeader>
        <ParticipantForm
          formId='start-collaboration-form'
          form={form}
          onSubmit={onSubmit}
          nameLabel='Name'
        />
        <DialogFooter>
          <Button
            form='start-collaboration-form'
            type='submit'
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <MessageSquarePlus className='size-4' />
            )}
            Start
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ScheduleSessionDialog({
  onOpenChange,
  open,
}: {
  onOpenChange: (open: boolean) => void
  open: boolean
}) {
  const mutation = useScheduleCommunitySession()
  const { form, handleApiSubmit } = useApiForm<z.input<typeof sessionSchema>>({
    defaultValues: {
      isOnline: true,
      location: '',
      participantIds: '',
      scheduledAt: '',
      title: '',
    },
    resolver: zodResolver(sessionSchema),
  })
  const onSubmit = handleApiSubmit(async (values) => {
    const promise = mutation.mutateAsync({
      isOnline: values.isOnline,
      location: values.location?.trim() || undefined,
      participantIds: parseParticipantIds(values.participantIds),
      scheduledAt: new Date(values.scheduledAt).toISOString(),
      title: values.title.trim(),
    })
    toast.promise(promise, {
      loading: 'Scheduling session...',
      success: 'Session scheduled.',
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
          <DialogTitle>Schedule session</DialogTitle>
          <DialogDescription>
            Schedule a community group session.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='schedule-session-form'
            onSubmit={onSubmit}
            className='grid gap-4'
          >
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
              name='scheduledAt'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scheduled at</FormLabel>
                  <FormControl>
                    <Input type='datetime-local' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='isOnline'
              render={({ field }) => (
                <FormItem className='flex items-center justify-between rounded-md border p-3'>
                  <FormLabel>Online session</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='location'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='participantIds'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Participant IDs</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            form='schedule-session-form'
            type='submit'
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <CalendarPlus className='size-4' />
            )}
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ParticipantForm({
  form,
  formId,
  nameLabel,
  onSubmit,
}: {
  form: ReturnType<
    typeof useApiForm<z.input<typeof collaborationSchema>>
  >['form']
  formId: string
  nameLabel: string
  onSubmit: FormEventHandler<HTMLFormElement>
}) {
  return (
    <Form {...form}>
      <form id={formId} onSubmit={onSubmit} className='grid gap-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{nameLabel}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='participantIds'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Participant IDs</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
