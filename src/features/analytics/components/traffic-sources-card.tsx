import { memo } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { type TrafficSource } from '../types/analytics'

type TrafficSourcesCardProps = {
  data: TrafficSource[]
}

export const TrafficSourcesCard = memo(function TrafficSourcesCard({
  data,
}: TrafficSourcesCardProps) {
  return (
    <Card className='border border-[var(--bdr)] bg-[var(--sur)]'>
      <CardHeader>
        <CardTitle className='text-[var(--t1)]'>Traffic Sources</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex items-center gap-6'>
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie
                data={data}
                dataKey='value'
                nameKey='name'
                cx='50%'
                cy='50%'
                innerRadius={45}
                outerRadius={65}
                paddingAngle={2}
                strokeWidth={0}
                isAnimationActive={false}
              >
                {data.map((source) => (
                  <Cell key={source.name} fill={source.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <ul className='flex-1 space-y-2.5'>
            {data.map((source) => (
              <li
                key={source.name}
                className='flex items-center justify-between text-[13px]'
              >
                <span className='flex items-center gap-2 text-[var(--t2)]'>
                  <span
                    className='h-2.5 w-2.5 rounded-[3px]'
                    style={{ backgroundColor: source.color }}
                  />
                  {source.name}
                </span>
                <span className='font-medium tabular-nums text-[var(--t1)]'>
                  {source.value}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
})
TrafficSourcesCard.displayName = 'TrafficSourcesCard'
