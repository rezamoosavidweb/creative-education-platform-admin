import { memo } from 'react'
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { ChartDataPoint } from '../../types/dashboard'

type GrowthChartProps = {
  data: ChartDataPoint[]
  isLoading?: boolean
  error?: string | null
}

function GrowthChartContent({ data }: { data: ChartDataPoint[] }) {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
          formatter={(value) => `${Number(value).toFixed(1)}%`}
        />
        <Line
          type='monotone'
          dataKey='value'
          stroke='hsl(var(--accent))'
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--accent))', r: 4 }}
          activeDot={{ r: 6 }}
          name='Growth Rate'
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export const GrowthChart = memo(function GrowthChart({
  data,
  isLoading = false,
  error,
}: GrowthChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Growth</CardTitle>
        <CardDescription>Growth rate trend over time</CardDescription>
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
          <GrowthChartContent data={data} />
        ) : (
          <div className='flex items-center justify-center py-8 text-sm text-muted-foreground'>
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  )
})
GrowthChart.displayName = 'GrowthChart'
