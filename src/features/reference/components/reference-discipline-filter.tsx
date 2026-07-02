import type { NavigateFn } from '@/hooks/use-table-url-state'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ReferenceItem } from '../types'

const ALL_DISCIPLINES_VALUE = '__all_disciplines__'

type ReferenceDisciplineFilterProps = {
  disciplines: ReferenceItem[]
  disabled?: boolean
  navigate: NavigateFn
  value?: string
}

export function ReferenceDisciplineFilter({
  disciplines,
  disabled,
  navigate,
  value,
}: ReferenceDisciplineFilterProps) {
  return (
    <div className='flex flex-wrap items-center gap-2'>
      <span className='text-sm font-medium text-muted-foreground'>
        Discipline
      </span>
      <Select
        value={value ?? ALL_DISCIPLINES_VALUE}
        disabled={disabled}
        onValueChange={(nextValue) => {
          navigate({
            search: (previous) => ({
              ...(previous as Record<string, unknown>),
              disciplineId:
                nextValue === ALL_DISCIPLINES_VALUE ? undefined : nextValue,
              page: undefined,
            }),
          })
        }}
      >
        <SelectTrigger className='min-w-56'>
          <SelectValue placeholder='All disciplines' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_DISCIPLINES_VALUE}>
            All disciplines
          </SelectItem>
          {disciplines.map((discipline) => (
            <SelectItem key={discipline.id} value={discipline.id}>
              {discipline.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
