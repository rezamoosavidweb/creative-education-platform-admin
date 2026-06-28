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
    <ResponsiveContainer width='100%' height={340}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id='revenueGradient' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='var(--pri)' stopOpacity={0.35} />
            <stop offset='95%' stopColor='var(--pri)' stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray='3 3' stroke='var(--bdr)' />
        <XAxis
          dataKey='name'
          stroke='var(--t3)'
          style={{ fontSize: '12px' }}
        />
        <YAxis stroke='var(--t3)' />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--sur)',
            border: '1px solid var(--bdr)',
            borderRadius: '0.5rem',
          }}
          formatter={(value) => `$${Number(value).toLocaleString()}`}
        />
        <Area
          type='monotone'
          dataKey='revenue'
          stroke='var(--pri)'
          fillOpacity={1}
          fill='url(#revenueGradient)'
          name='Revenue'
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
    <Card className='border-[var(--bdr)] bg-[var(--sur)]'>
      <CardHeader>
        <CardTitle className='text-[var(--t1)]'>Revenue Overview</CardTitle>
        <CardDescription className='text-[var(--t2)]'>
          Monthly revenue — last 12 months
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
          <RevenueChartContent data={data} />
        ) : (
          <div className='flex items-center justify-center py-8 text-sm text-[var(--t3)]'>
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  )
})
RevenueChart.displayName = 'RevenueChart'
