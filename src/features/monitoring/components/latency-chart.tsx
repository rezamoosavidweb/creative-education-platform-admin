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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { type LatencyPoint } from '../types/monitoring'

type LatencyChartProps = {
  data: LatencyPoint[]
  averageLabel?: string
}

export const LatencyChart = memo(function LatencyChart({
  data,
  averageLabel = 'p50: 48ms avg',
}: LatencyChartProps) {
  return (
    <Card className='border border-[var(--bdr)] bg-[var(--sur)]'>
      <CardHeader className='flex flex-row items-start justify-between space-y-0'>
        <div className='space-y-1.5'>
          <CardTitle className='text-[var(--t1)]'>API Response Time</CardTitle>
          <CardDescription className='text-[var(--t2)]'>
            P50 latency — last 24 hours
          </CardDescription>
        </div>
        <span className='rounded-full bg-[var(--oks)] px-2.5 py-1 text-xs font-medium text-[var(--ok)]'>
          {averageLabel}
        </span>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={260}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id='latencyGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='var(--pri)' stopOpacity={0.35} />
                <stop offset='95%' stopColor='var(--pri)' stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray='3 3'
              stroke='var(--bdr)'
              vertical={false}
            />
            <XAxis
              dataKey='label'
              stroke='var(--t3)'
              interval={0}
              tickLine={false}
              axisLine={false}
              style={{ fontSize: '11px' }}
            />
            <YAxis
              stroke='var(--t3)'
              tickLine={false}
              axisLine={false}
              width={40}
              tickFormatter={(value) => `${value}ms`}
              style={{ fontSize: '11px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--sur)',
                border: '1px solid var(--bdr)',
                borderRadius: '0.5rem',
              }}
              formatter={(value) => [`${value}ms`, 'P50 latency']}
            />
            <Area
              type='monotone'
              dataKey='latency'
              stroke='var(--pri)'
              strokeWidth={2}
              fill='url(#latencyGradient)'
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
})
LatencyChart.displayName = 'LatencyChart'
