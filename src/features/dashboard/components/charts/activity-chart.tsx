import { memo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { ActivityData } from '../../types/dashboard'

type ActivityChartProps = {
  data: ActivityData[]
  isLoading?: boolean
  error?: string | null
}

function ActivityChartContent({ data }: { data: ActivityData[] }) {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray='3 3' stroke='hsl(var(--border))' />
        <XAxis
          dataKey='name'
          stroke='hsl(var(--muted-foreground))'
          style={{ fontSize: '12px' }}
        />
        <YAxis stroke='hsl(var(--muted-foreground))' />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.5rem',
          }}
        />
        <Bar dataKey='count' fill='hsl(var(--primary))' radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export const ActivityChart = memo(function ActivityChart({
  data,
  isLoading = false,
  error,
}: ActivityChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>Daily activity over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className='flex items-center justify-center py-8 text-sm text-destructive'>
            {error}
          </div>
        ) : isLoading ? (
          <div className='flex items-center justify-center py-8'>
            <div className='h-64 w-full animate-pulse rounded bg-muted' />
          </div>
        ) : data.length > 0 ? (
          <ActivityChartContent data={data} />
        ) : (
          <div className='flex items-center justify-center py-8 text-sm text-muted-foreground'>
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  )
})
ActivityChart.displayName = 'ActivityChart'
