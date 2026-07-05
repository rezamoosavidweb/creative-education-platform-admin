import type {
  CollaborationDto,
  CreateGroupDto,
  GroupDto,
  GroupInvitationDto,
  GroupMemberDto,
  GroupSessionDto,
  InviteMemberDto,
  ScheduleSessionDto,
  StartCollaborationDto,
} from '@/lib/api/generated/model'

export type CommunityGroup = GroupDto
export type CommunityInvitation = GroupInvitationDto
export type CommunityMember = GroupMemberDto
export type CommunityCollaboration = CollaborationDto
export type CommunitySession = GroupSessionDto
export type CreateGroupRequest = CreateGroupDto
export type InviteMemberRequest = InviteMemberDto
export type StartCollaborationRequest = StartCollaborationDto
export type ScheduleCommunitySessionRequest = ScheduleSessionDto
