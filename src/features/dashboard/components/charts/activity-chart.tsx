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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { ActivityData } from '../../types/dashboard'

type ActivityChartProps = {
  data: ActivityData[]
  isLoading?: boolean
  error?: string | null
}

function ActivityChartContent({ data }: { data: ActivityData[] }) {
  return (
    <ResponsiveContainer width='100%' height={340}>
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray='3 3' stroke='var(--bdr)' />
        <XAxis dataKey='name' stroke='var(--t3)' style={{ fontSize: '12px' }} />
        <YAxis stroke='var(--t3)' />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--sur)',
            border: '1px solid var(--bdr)',
            borderRadius: '0.5rem',
          }}
        />
        <Bar dataKey='count' fill='var(--info)' radius={[4, 4, 0, 0]} />
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
    <Card className='border-[var(--bdr)] bg-[var(--sur)]'>
      <CardHeader>
        <CardTitle className='text-[var(--t1)]'>New Users</CardTitle>
        <CardDescription className='text-[var(--t2)]'>
          Weekly signups — last 8 weeks
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className='flex items-center justify-center py-8 text-sm text-[var(--err)]'>
            {error}
          </div>
        ) : isLoading ? (
          <div className='flex items-center justify-center py-8'>
            <div className='h-64 w-full animate-pulse rounded bg-[var(--sur2)]' />
          </div>
        ) : data.length > 0 ? (
          <ActivityChartContent data={data} />
        ) : (
          <div className='flex items-center justify-center py-8 text-sm text-[var(--t3)]'>
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  )
})
ActivityChart.displayName = 'ActivityChart'
