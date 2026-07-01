import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ApiError, ApiLoading } from '@/components/api'
import { StatusPill } from '@/components/status-pill'
import { usePublicProfile } from '../hooks/use-public-profile'
import { formatProfileDateTime } from '../services/profiles-query'

type ProfileDetailsDialogProps = {
  handle: string | null
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function ProfileDetailsDialog({
  handle,
  onOpenChange,
  open,
}: ProfileDetailsDialogProps) {
  const profileQuery = usePublicProfile(handle)
  const profile = profileQuery.data?.data

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>
            {profile?.displayName ?? handle ?? 'Profile'}
          </DialogTitle>
          <DialogDescription>Published profile details.</DialogDescription>
        </DialogHeader>

        {profileQuery.isLoading && <ApiLoading label='Loading profile...' />}
        {profileQuery.error && (
          <ApiError error={profileQuery.error} onRetry={profileQuery.refetch} />
        )}
        {profile && (
          <div className='grid gap-4 sm:grid-cols-2'>
            <DetailItem label='Handle'>@{profile.handle}</DetailItem>
            <DetailItem label='Status'>
              <StatusPill tone={profile.published ? 'ok' : 'neutral'}>
                {profile.published ? 'Published' : 'Private'}
              </StatusPill>
            </DetailItem>
            <DetailItem label='Headline'>
              {profile.headline ?? 'None'}
            </DetailItem>
            <DetailItem label='Location'>
              {[profile.city, profile.region, profile.country]
                .filter(Boolean)
                .join(', ') || 'None'}
            </DetailItem>
            <DetailItem label='Created'>
              {formatProfileDateTime(profile.createdAt)}
            </DetailItem>
            <DetailItem label='Updated'>
              {formatProfileDateTime(profile.updatedAt)}
            </DetailItem>
            <div className='sm:col-span-2'>
              <DetailItem label='Bio'>{profile.bio ?? 'None'}</DetailItem>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
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
    <div className='space-y-1'>
      <div className='text-xs font-medium text-muted-foreground'>{label}</div>
      <div className='text-sm text-[var(--t1)]'>{children}</div>
    </div>
  )
}
