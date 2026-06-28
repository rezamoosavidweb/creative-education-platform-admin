import { memo } from 'react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'

export type SparklineData = {
  value: number
}

type SparklineProps = {
  data: SparklineData[]
  color?: string
  height?: number
  width?: number
}

export const Sparkline = memo(function Sparkline({
  data,
  color = 'var(--pri)',
  height = 28,
  width = 80,
}: SparklineProps) {
  if (!data || data.length === 0) {
    return null
  }

  return (
    <ResponsiveContainer width={width} height={height}>
      <AreaChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <defs>
          <linearGradient id='sparklineGradient' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor={color} stopOpacity={0.3} />
            <stop offset='100%' stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type='monotone'
          dataKey='value'
          fill='url(#sparklineGradient)'
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
})
Sparkline.displayName = 'Sparkline'
