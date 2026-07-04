import type { ReactNode } from 'react'
import { Link, getRouteApi } from '@tanstack/react-router'
import { ArrowLeft, Mail, Phone, UserRound } from 'lucide-react'
import {
  getAuthUserAvatar,
  getAuthUserDisplayName,
  getAuthUserEmail,
  getAuthUserInitials,
  getAuthUserRoleLabel,
} from '@/lib/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ApiEmpty, ApiError, ApiLoading } from '@/components/api'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { StatusPill } from '@/components/status-pill'
import { useUserDetails } from './hooks/use-user-details'
import type { AdminUser } from './types'

const route = getRouteApi('/_authenticated/users/$userId')

export function UserDetails() {
  const { userId } = route.useParams()
  const userQuery = useUserDetails(userId)
  const user = userQuery.data?.data

  return (
    <>
      <Header fixed />
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div className='space-y-1'>
            <Button variant='ghost' size='sm' asChild className='-ms-2'>
              <Link to='/users'>
                <ArrowLeft className='size-4' />
                Users
              </Link>
            </Button>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                User Details
              </h2>
              <p className='text-muted-foreground'>
                Identity record from the backend user service.
              </p>
            </div>
          </div>
        </div>

        {userQuery.isLoading && <ApiLoading label='Loading user...' />}
        {userQuery.isError && (
          <ApiError
            error={userQuery.error}
            onRetry={() => {
              void userQuery.refetch()
            }}
          />
        )}
        {!userQuery.isLoading && !userQuery.isError && !user && (
          <ApiEmpty
            title='User not found'
            description='The backend did not return a user for this id.'
          />
        )}
        {user && (
          <div className='grid gap-4 sm:gap-6 lg:grid-cols-[1.2fr_0.8fr]'>
            <Card>
              <CardHeader>
                <CardTitle>Identity</CardTitle>
                <CardDescription>
                  Core account identity exposed by UserDto.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-5'>
                <div className='flex flex-wrap items-center gap-4'>
                  <Avatar className='size-16'>
                    <AvatarImage
                      src={getAuthUserAvatar(user)}
                      alt={getAuthUserDisplayName(user)}
                    />
                    <AvatarFallback>{getAuthUserInitials(user)}</AvatarFallback>
                  </Avatar>
                  <div className='space-y-1'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <h3 className='text-lg font-semibold text-[var(--t1)]'>
                        {getAuthUserDisplayName(user)}
                      </h3>
                      <UserStatus user={user} />
                    </div>
                    <p className='text-sm text-muted-foreground'>{user.id}</p>
                  </div>
                </div>

                <div className='grid gap-3 sm:grid-cols-2'>
                  <DetailItem label='First name'>
                    {user.firstName || 'Not provided'}
                  </DetailItem>
                  <DetailItem label='Last name'>
                    {user.lastName || 'Not provided'}
                  </DetailItem>
                  <DetailItem label='Role'>
                    {getAuthUserRoleLabel(user)}
                  </DetailItem>
                  <DetailItem label='Status'>
                    <UserStatus user={user} />
                  </DetailItem>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  Contact fields currently exposed by the backend.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <DetailItem icon={<Mail className='size-4' />} label='Email'>
                  {getAuthUserEmail(user)}
                </DetailItem>
                <DetailItem icon={<Phone className='size-4' />} label='Phone'>
                  {user.phone || 'Not provided'}
                </DetailItem>
                <DetailItem
                  icon={<UserRound className='size-4' />}
                  label='Avatar'
                >
                  {user.avatar || 'Not provided'}
                </DetailItem>
              </CardContent>
            </Card>

            <Card className='lg:col-span-2'>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
                <CardDescription>
                  Backend record identifiers and timestamps.
                </CardDescription>
              </CardHeader>
              <CardContent className='grid gap-3 sm:grid-cols-3'>
                <DetailItem label='User ID'>{user.id}</DetailItem>
                <DetailItem label='Created'>
                  {formatDateTime(user.createdAt)}
                </DetailItem>
                <DetailItem label='Updated'>
                  {formatDateTime(user.updatedAt)}
                </DetailItem>
              </CardContent>
            </Card>
          </div>
        )}
      </Main>
    </>
  )
}

function UserStatus({ user }: { user: AdminUser }) {
  if (user.isActive === false) {
    return <StatusPill tone='err'>Inactive</StatusPill>
  }

  if (user.isActive === true) {
    return <StatusPill tone='ok'>Active</StatusPill>
  }

  return <StatusPill tone='neutral'>Unknown</StatusPill>
}

function DetailItem({
  children,
  icon,
  label,
}: {
  children: ReactNode
  icon?: ReactNode
  label: string
}) {
  return (
    <div className='space-y-1 rounded-md border bg-[var(--sur)] p-3'>
      <div className='flex items-center gap-1.5 text-xs font-medium text-muted-foreground'>
        {icon}
        {label}
      </div>
      <div className='text-sm break-words text-[var(--t1)]'>{children}</div>
    </div>
  )
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}
