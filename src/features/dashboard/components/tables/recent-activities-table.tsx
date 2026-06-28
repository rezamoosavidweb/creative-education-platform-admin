import { memo } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ShoppingCart, UserPlus, CreditCard, AlertCircle } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Activity } from '../../types/dashboard'
import { ACTIVITY_TYPES } from '../../constants/dashboard-config'

type RecentActivitiesTableProps = {
  data: Activity[]
  isLoading?: boolean
  error?: string | null
}

function getActivityIcon(type: Activity['type']) {
  const icons: Record<Activity['type'], typeof ShoppingCart> = {
    sale: ShoppingCart,
    user_signup: UserPlus,
    payment: CreditCard,
    error: AlertCircle,
  }
  return icons[type]
}

function RecentActivitiesTableContent({ data }: { data: Activity[] }) {
  return (
    <div className='overflow-x-auto'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Activity</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className='text-right'>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((activity) => {
            const Icon = getActivityIcon(activity.type)
            const typeConfig = ACTIVITY_TYPES[activity.type]

            return (
              <TableRow key={activity.id}>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <div
                      className={cn(
                        'rounded-lg p-2',
                        activity.type === 'sale' && 'bg-green-100',
                        activity.type === 'user_signup' && 'bg-blue-100',
                        activity.type === 'payment' && 'bg-yellow-100',
                        activity.type === 'error' && 'bg-red-100'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-4 w-4',
                          activity.type === 'sale' && 'text-green-600',
                          activity.type === 'user_signup' && 'text-blue-600',
                          activity.type === 'payment' && 'text-yellow-600',
                          activity.type === 'error' && 'text-red-600'
                        )}
                      />
                    </div>
                    <div>
                      <p className='font-medium'>{activity.title}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className='text-sm text-muted-foreground'>
                  {activity.description}
                </TableCell>
                <TableCell>
                  <Badge
                    variant='secondary'
                    className={cn(
                      activity.type === 'sale' && 'bg-green-100 text-green-800',
                      activity.type === 'user_signup' && 'bg-blue-100 text-blue-800',
                      activity.type === 'payment' && 'bg-yellow-100 text-yellow-800',
                      activity.type === 'error' && 'bg-red-100 text-red-800'
                    )}
                  >
                    {typeConfig.label}
                  </Badge>
                </TableCell>
                <TableCell className='text-right text-sm text-muted-foreground'>
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export const RecentActivitiesTable = memo(function RecentActivitiesTable({
  data,
  isLoading = false,
  error,
}: RecentActivitiesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Latest activities from your platform</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className='flex items-center justify-center py-8 text-sm text-destructive'>
            {error}
          </div>
        ) : isLoading ? (
          <div className='space-y-2'>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className='h-10 animate-pulse rounded bg-muted' />
            ))}
          </div>
        ) : data.length > 0 ? (
          <RecentActivitiesTableContent data={data} />
        ) : (
          <div className='flex items-center justify-center py-8 text-sm text-muted-foreground'>
            No activities available
          </div>
        )}
      </CardContent>
    </Card>
  )
})
RecentActivitiesTable.displayName = 'RecentActivitiesTable'
