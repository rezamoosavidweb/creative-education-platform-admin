import { memo } from 'react'
import { cn } from '@/lib/utils'
import { type TimeRange } from '../types/analytics'

type TimeRangeToggleProps = {
  value: TimeRange
  onChange: (value: TimeRange) => void
}

const OPTIONS: { value: TimeRange; label: string }[] = [
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' },
  { value: '90d', label: '90d' },
  { value: 'custom', label: 'Custom' },
]

export const TimeRangeToggle = memo(function TimeRangeToggle({
  value,
  onChange,
}: TimeRangeToggleProps) {
  return (
    <div className='inline-flex items-center gap-1 rounded-lg border border-[var(--bdr)] bg-[var(--sur)] p-1'>
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type='button'
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={cn(
            'rounded-md px-3 py-1 text-[13px] font-medium transition-colors',
            value === option.value
              ? 'bg-[var(--pri)] text-white'
              : 'text-[var(--t2)] hover:text-[var(--t1)]'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
})
TimeRangeToggle.displayName = 'TimeRangeToggle'
