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
          <TableRow className='border-[var(--bdr)]'>
            <TableHead className='text-[var(--t2)]'>Activity</TableHead>
            <TableHead className='text-[var(--t2)]'>Description</TableHead>
            <TableHead className='text-[var(--t2)]'>Type</TableHead>
            <TableHead className='text-right text-[var(--t2)]'>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((activity) => {
            const Icon = getActivityIcon(activity.type)
            const typeConfig = ACTIVITY_TYPES[activity.type]

            return (
              <TableRow key={activity.id} className='border-[var(--bdr)] hover:bg-[var(--sur2)]'>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <div
                      className={cn(
                        'rounded-lg p-2',
                        activity.type === 'sale' && 'bg-[var(--oks)]',
                        activity.type === 'user_signup' && 'bg-[var(--infos)]',
                        activity.type === 'payment' && 'bg-[var(--warns)]',
                        activity.type === 'error' && 'bg-[var(--errs)]'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-4 w-4',
                          activity.type === 'sale' && 'text-[var(--ok)]',
                          activity.type === 'user_signup' && 'text-[var(--info)]',
                          activity.type === 'payment' && 'text-[var(--warn)]',
                          activity.type === 'error' && 'text-[var(--err)]'
                        )}
                      />
                    </div>
                    <div>
                      <p className='font-medium text-[var(--t1)]'>{activity.title}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className='text-sm text-[var(--t2)]'>
                  {activity.description}
                </TableCell>
                <TableCell>
                  <Badge
                    variant='secondary'
                    className={cn(
                      activity.type === 'sale' && 'bg-[var(--oks)] text-[var(--ok)]',
                      activity.type === 'user_signup' && 'bg-[var(--infos)] text-[var(--info)]',
                      activity.type === 'payment' && 'bg-[var(--warns)] text-[var(--warn)]',
                      activity.type === 'error' && 'bg-[var(--errs)] text-[var(--err)]'
                    )}
                  >
                    {typeConfig.label}
                  </Badge>
                </TableCell>
                <TableCell className='text-right text-sm text-[var(--t3)]'>
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
    <Card className='border-[var(--bdr)] bg-[var(--sur)]'>
      <CardHeader>
        <CardTitle className='text-[var(--t1)]'>Recent Activity</CardTitle>
        <CardDescription className='text-[var(--t2)]'>
          Latest activities from your platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className='flex items-center justify-center py-8 text-sm text-[var(--err)]'>
            {error}
          </div>
        ) : isLoading ? (
          <div className='space-y-2'>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className='h-10 animate-pulse rounded bg-[var(--sur2)]' />
            ))}
          </div>
        ) : data.length > 0 ? (
          <RecentActivitiesTableContent data={data} />
        ) : (
          <div className='flex items-center justify-center py-8 text-sm text-[var(--t3)]'>
            No activities available
          </div>
        )}
      </CardContent>
    </Card>
  )
})
RecentActivitiesTable.displayName = 'RecentActivitiesTable'
