import { memo } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { RevenueData } from '../../types/dashboard'

type RevenueChartProps = {
  data: RevenueData[]
  isLoading?: boolean
  error?: string | null
}

function RevenueChartContent({ data }: { data: RevenueData[] }) {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id='colorRevenue' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='hsl(var(--primary))' stopOpacity={0.8} />
            <stop offset='95%' stopColor='hsl(var(--primary))' stopOpacity={0} />
          </linearGradient>
          <linearGradient id='colorCost' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='hsl(var(--secondary))' stopOpacity={0.8} />
            <stop offset='95%' stopColor='hsl(var(--secondary))' stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray='3 3' stroke='hsl(var(--border))' />
        <XAxis dataKey='name' stroke='hsl(var(--muted-foreground))' />
        <YAxis stroke='hsl(var(--muted-foreground))' />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.5rem',
          }}
          formatter={(value) => `$${Number(value).toLocaleString()}`}
        />
        <Area
          type='monotone'
          dataKey='revenue'
          stroke='hsl(var(--primary))'
          fillOpacity={1}
          fill='url(#colorRevenue)'
          name='Revenue'
        />
        <Area
          type='monotone'
          dataKey='cost'
          stroke='hsl(var(--secondary))'
          fillOpacity={1}
          fill='url(#colorCost)'
          name='Cost'
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export const RevenueChart = memo(function RevenueChart({
  data,
  isLoading = false,
  error,
}: RevenueChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <CardDescription>Monthly revenue and costs</CardDescription>
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
          <RevenueChartContent data={data} />
        ) : (
          <div className='flex items-center justify-center py-8 text-sm text-muted-foreground'>
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  )
})
RevenueChart.displayName = 'RevenueChart'
