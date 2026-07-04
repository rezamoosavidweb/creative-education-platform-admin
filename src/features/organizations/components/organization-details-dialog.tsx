import { useState } from 'react'
import { KeyRound, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ApiEmpty, ApiError, ApiLoading } from '@/components/api'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { LongText } from '@/components/long-text'
import { StatusPill } from '@/components/status-pill'
import { useOrganization } from '../hooks/use-organization'
import { useOrganizationMembers } from '../hooks/use-organization-members'
import { useOrganizationTeams } from '../hooks/use-organization-teams'
import { useRemoveOrganizationMember } from '../hooks/use-remove-organization-member'
import {
  formatOrganizationDateTime,
  getMembershipStatusTone,
  getOrganizationMembers,
  getOrganizationTeams,
  getOrgRoleTone,
} from '../services/organizations-query'
import type { Organization, OrgMembership } from '../types'
import { AddMemberDialog } from './add-member-dialog'
import { AssignRoleDialog } from './assign-role-dialog'
import { CreateTeamDialog } from './create-team-dialog'

type OrganizationDetailsDialogProps = {
  onOpenChange: (open: boolean) => void
  open: boolean
  organization: Organization | null
}

export function OrganizationDetailsDialog({
  onOpenChange,
  open,
  organization,
}: OrganizationDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[85vh] overflow-y-auto sm:max-w-4xl'>
        <DialogHeader>
          <DialogTitle>{organization?.name ?? 'Organization'}</DialogTitle>
          <DialogDescription>
            Backend organization record, memberships, and teams.
          </DialogDescription>
        </DialogHeader>
        {organization && (
          <OrganizationDetailsContent organization={organization} />
        )}
      </DialogContent>
    </Dialog>
  )
}

function OrganizationDetailsContent({
  organization,
}: {
  organization: Organization
}) {
  const [addMemberOpen, setAddMemberOpen] = useState(false)
  const [createTeamOpen, setCreateTeamOpen] = useState(false)
  const [assignRoleMembership, setAssignRoleMembership] =
    useState<OrgMembership | null>(null)
  const [removeMembership, setRemoveMembership] =
    useState<OrgMembership | null>(null)
  const organizationQuery = useOrganization(organization.id)
  const membersQuery = useOrganizationMembers(organization.id)
  const teamsQuery = useOrganizationTeams(organization.id)
  const removeMutation = useRemoveOrganizationMember()
  const details = organizationQuery.data?.data ?? organization
  const members = getOrganizationMembers(membersQuery.data?.data)
  const teams = getOrganizationTeams(teamsQuery.data?.data)

  async function removeSelectedMember() {
    if (!removeMembership) return

    const removePromise = removeMutation.mutateAsync({
      orgId: removeMembership.orgId,
      userId: removeMembership.userId,
    })

    toast.promise(removePromise, {
      loading: 'Removing member...',
      success: 'Member removed.',
      error: getApiErrorMessage,
    })

    await removePromise
    setRemoveMembership(null)
  }

  return (
    <>
      <div className='grid gap-4 lg:grid-cols-[1fr_1.2fr]'>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Identity</CardTitle>
          </CardHeader>
          <CardContent className='grid gap-3 text-sm'>
            {organizationQuery.isLoading ? (
              <ApiLoading label='Loading organization...' />
            ) : organizationQuery.error ? (
              <ApiError
                error={organizationQuery.error}
                onRetry={() => {
                  void organizationQuery.refetch()
                }}
              />
            ) : (
              <>
                <DetailItem label='Organization ID'>{details.id}</DetailItem>
                <DetailItem label='Name'>{details.name}</DetailItem>
                <DetailItem label='Type'>{details.type}</DetailItem>
                <DetailItem label='Disciplines'>
                  {details.disciplineIds.length.toLocaleString()}
                </DetailItem>
                <DetailItem label='Created'>
                  {formatOrganizationDateTime(details.createdAt)}
                </DetailItem>
                <DetailItem label='Updated'>
                  {formatOrganizationDateTime(details.updatedAt)}
                </DetailItem>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between gap-3'>
            <CardTitle className='text-base'>Teams</CardTitle>
            <Button
              type='button'
              size='sm'
              onClick={() => setCreateTeamOpen(true)}
            >
              <Plus className='size-4' />
              Team
            </Button>
          </CardHeader>
          <CardContent className='grid gap-3'>
            {teamsQuery.isLoading ? (
              <ApiLoading label='Loading teams...' />
            ) : teamsQuery.error ? (
              <ApiError
                error={teamsQuery.error}
                onRetry={() => {
                  void teamsQuery.refetch()
                }}
              />
            ) : teams.length === 0 ? (
              <ApiEmpty
                title='No teams'
                description='The backend returned no teams for this organization.'
              />
            ) : (
              teams.map((team) => (
                <div
                  key={team.id}
                  className='rounded-md border border-[var(--bdr)] p-3'
                >
                  <div className='font-medium text-[var(--t1)]'>
                    {team.name}
                  </div>
                  <LongText className='text-xs text-muted-foreground'>
                    {team.id}
                  </LongText>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between gap-3'>
          <CardTitle className='text-base'>Members</CardTitle>
          <Button
            type='button'
            size='sm'
            onClick={() => setAddMemberOpen(true)}
          >
            <Plus className='size-4' />
            Member
          </Button>
        </CardHeader>
        <CardContent className='grid gap-3'>
          {membersQuery.isLoading ? (
            <ApiLoading label='Loading members...' />
          ) : membersQuery.error ? (
            <ApiError
              error={membersQuery.error}
              onRetry={() => {
                void membersQuery.refetch()
              }}
            />
          ) : members.length === 0 ? (
            <ApiEmpty
              title='No members'
              description='The backend returned no active or invited members.'
            />
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className='flex flex-wrap items-center justify-between gap-3 rounded-md border border-[var(--bdr)] p-3'
              >
                <div className='min-w-0 space-y-1'>
                  <LongText className='max-w-72 font-medium text-[var(--t1)]'>
                    {member.userId}
                  </LongText>
                  <LongText className='max-w-72 text-xs text-muted-foreground'>
                    {member.id}
                  </LongText>
                </div>
                <div className='flex flex-wrap items-center gap-2'>
                  <StatusPill tone={getOrgRoleTone(member.role)}>
                    {member.role}
                  </StatusPill>
                  <StatusPill tone={getMembershipStatusTone(member.status)}>
                    {member.status}
                  </StatusPill>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => setAssignRoleMembership(member)}
                  >
                    <KeyRound className='size-4' />
                    Role
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    disabled={removeMutation.isPending}
                    onClick={() => setRemoveMembership(member)}
                    className='border-[var(--err)]/40 text-[var(--err)] hover:bg-[var(--errs)] hover:text-[var(--err)]'
                  >
                    <Trash2 className='size-4' />
                    Remove
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <AddMemberDialog
        orgId={organization.id}
        open={addMemberOpen}
        onOpenChange={setAddMemberOpen}
      />
      <CreateTeamDialog
        orgId={organization.id}
        open={createTeamOpen}
        onOpenChange={setCreateTeamOpen}
      />
      <AssignRoleDialog
        membership={assignRoleMembership}
        open={!!assignRoleMembership}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setAssignRoleMembership(null)
        }}
      />
      <ConfirmDialog
        open={!!removeMembership}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setRemoveMembership(null)
        }}
        title='Remove member'
        desc={
          removeMembership
            ? `Remove user ${removeMembership.userId} from this organization?`
            : 'Remove this member from this organization?'
        }
        confirmText='Remove'
        destructive
        isLoading={removeMutation.isPending}
        handleConfirm={() => {
          void removeSelectedMember()
        }}
      />
    </>
  )
}

function DetailItem({
  children,
  label,
}: {
  children: React.ReactNode
  label: string
}) {
  return (
    <div className='grid gap-1'>
      <span className='text-xs font-medium text-muted-foreground uppercase'>
        {label}
      </span>
      <LongText className='max-w-full text-[var(--t1)]'>{children}</LongText>
    </div>
  )
}
