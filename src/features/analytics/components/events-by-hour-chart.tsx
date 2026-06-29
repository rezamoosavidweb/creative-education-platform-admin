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
import { type HourPoint } from '../types/analytics'

type EventsByHourChartProps = {
  data: HourPoint[]
}

export const EventsByHourChart = memo(function EventsByHourChart({
  data,
}: EventsByHourChartProps) {
  return (
    <Card className='border border-[var(--bdr)] bg-[var(--sur)]'>
      <CardHeader>
        <CardTitle className='text-[var(--t1)]'>Events by Hour</CardTitle>
        <CardDescription className='text-[var(--t2)]'>
          Average event count — last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={240}>
          <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray='3 3' stroke='var(--bdr)' vertical={false} />
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
              width={36}
              style={{ fontSize: '11px' }}
            />
            <Tooltip
              cursor={{ fill: 'var(--sur2)' }}
              contentStyle={{
                backgroundColor: 'var(--sur)',
                border: '1px solid var(--bdr)',
                borderRadius: '0.5rem',
              }}
            />
            <Bar dataKey='count' fill='var(--pri)' radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
})
EventsByHourChart.displayName = 'EventsByHourChart'
