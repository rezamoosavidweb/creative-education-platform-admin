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
import { type TrafficPoint } from '../types/analytics'

type TrafficOverviewChartProps = {
  data: TrafficPoint[]
}

export const TrafficOverviewChart = memo(function TrafficOverviewChart({
  data,
}: TrafficOverviewChartProps) {
  return (
    <Card className='border border-[var(--bdr)] bg-[var(--sur)]'>
      <CardHeader>
        <CardTitle className='text-[var(--t1)]'>Traffic Overview</CardTitle>
        <CardDescription className='text-[var(--t2)]'>
          Page views per day — last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={280}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id='trafficGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='var(--pri)' stopOpacity={0.35} />
                <stop offset='95%' stopColor='var(--pri)' stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray='3 3'
              stroke='var(--bdr)'
              vertical={false}
            />
            <XAxis dataKey='label' hide />
            <YAxis
              stroke='var(--t3)'
              tickLine={false}
              axisLine={false}
              width={48}
              tickFormatter={(value) => `${(Number(value) / 1000).toFixed(0)}k`}
              style={{ fontSize: '11px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--sur)',
                border: '1px solid var(--bdr)',
                borderRadius: '0.5rem',
              }}
              formatter={(value) => [
                Number(value).toLocaleString(),
                'Page views',
              ]}
            />
            <Area
              type='monotone'
              dataKey='views'
              stroke='var(--pri)'
              strokeWidth={2}
              fill='url(#trafficGradient)'
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
})
TrafficOverviewChart.displayName = 'TrafficOverviewChart'
