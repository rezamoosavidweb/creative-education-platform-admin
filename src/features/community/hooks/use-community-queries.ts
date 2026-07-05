import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  collaborationControllerListMine,
  collaborationControllerStart,
  groupControllerAccept,
  groupControllerCreate,
  groupControllerDecline,
  groupControllerDisband,
  groupControllerInvitations,
  groupControllerInvite,
  groupControllerLeave,
  groupControllerListMine,
  groupControllerMembers,
  groupControllerRemoveMember,
  sessionControllerListMine,
  sessionControllerSchedule,
} from '@/lib/api/generated/endpoints/community/community'
import type {
  CreateGroupRequest,
  InviteMemberRequest,
  ScheduleCommunitySessionRequest,
  StartCollaborationRequest,
} from '../types'

export const communityQueryKeys = {
  all: ['community'] as const,
  collaborations: () => [...communityQueryKeys.all, 'collaborations'] as const,
  groups: () => [...communityQueryKeys.all, 'groups'] as const,
  invitations: () => [...communityQueryKeys.all, 'invitations'] as const,
  members: (groupId: string | null) =>
    [...communityQueryKeys.all, 'groups', groupId, 'members'] as const,
  sessions: () => [...communityQueryKeys.all, 'sessions'] as const,
}

export function useMyGroups() {
  return useQuery({
    queryFn: ({ signal }) => groupControllerListMine(undefined, signal),
    queryKey: communityQueryKeys.groups(),
  })
}

export function useGroupMembers(groupId: string | null) {
  return useQuery({
    enabled: Boolean(groupId),
    queryFn: ({ signal }) =>
      groupControllerMembers(groupId ?? '', undefined, signal),
    queryKey: communityQueryKeys.members(groupId),
  })
}

export function useGroupInvitations() {
  return useQuery({
    queryFn: ({ signal }) => groupControllerInvitations(undefined, signal),
    queryKey: communityQueryKeys.invitations(),
  })
}

export function useMyCollaborations() {
  return useQuery({
    queryFn: ({ signal }) => collaborationControllerListMine(undefined, signal),
    queryKey: communityQueryKeys.collaborations(),
  })
}

export function useMyCommunitySessions() {
  return useQuery({
    queryFn: ({ signal }) => sessionControllerListMine(undefined, signal),
    queryKey: communityQueryKeys.sessions(),
  })
}

export function useCreateGroup() {
  return useCommunityMutation((variables: CreateGroupRequest) =>
    groupControllerCreate(variables)
  )
}

export function useInviteGroupMember() {
  return useCommunityMutation(
    ({ groupId, body }: { body: InviteMemberRequest; groupId: string }) =>
      groupControllerInvite(groupId, body)
  )
}

export function useAcceptGroupInvitation() {
  return useCommunityMutation((invitationId: string) =>
    groupControllerAccept(invitationId)
  )
}

export function useDeclineGroupInvitation() {
  return useCommunityMutation((invitationId: string) =>
    groupControllerDecline(invitationId)
  )
}

export function useLeaveGroup() {
  return useCommunityMutation((groupId: string) =>
    groupControllerLeave(groupId)
  )
}

export function useDisbandGroup() {
  return useCommunityMutation((groupId: string) =>
    groupControllerDisband(groupId)
  )
}

export function useRemoveGroupMember() {
  return useCommunityMutation(
    ({ groupId, userId }: { groupId: string; userId: string }) =>
      groupControllerRemoveMember(groupId, userId)
  )
}

export function useStartCollaboration() {
  return useCommunityMutation((variables: StartCollaborationRequest) =>
    collaborationControllerStart(variables)
  )
}

export function useScheduleCommunitySession() {
  return useCommunityMutation((variables: ScheduleCommunitySessionRequest) =>
    sessionControllerSchedule(variables)
  )
}

function useCommunityMutation<TVariables, TResult>(
  mutationFn: (variables: TVariables) => Promise<TResult>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: communityQueryKeys.all })
    },
  })
}
