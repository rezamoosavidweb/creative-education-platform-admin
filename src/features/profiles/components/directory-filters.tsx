import { useState } from 'react'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type DirectoryFiltersProps = {
  navigate: NavigateFn
  search: Record<string, unknown>
}

export function DirectoryFilters({ navigate, search }: DirectoryFiltersProps) {
  const [country, setCountry] = useState(readString(search.country))
  const [availableForHire, setAvailableForHire] = useState(
    readBooleanFilter(search.availableForHire)
  )
  const [verified, setVerified] = useState(readBooleanFilter(search.verified))

  const applyFilters = () => {
    navigate({
      search: (previous) => ({
        ...(previous as Record<string, unknown>),
        availableForHire: toBooleanSearchValue(availableForHire),
        country: country.trim() || undefined,
        page: undefined,
        verified: toBooleanSearchValue(verified),
      }),
    })
  }

  const resetFilters = () => {
    setCountry('')
    setAvailableForHire('all')
    setVerified('all')
    navigate({
      search: (previous) => ({
        ...(previous as Record<string, unknown>),
        availableForHire: undefined,
        country: undefined,
        page: undefined,
        verified: undefined,
      }),
    })
  }

  return (
    <div className='flex flex-wrap items-end gap-2'>
      <div className='grid gap-1.5'>
        <label className='text-xs font-medium text-muted-foreground'>
          Country
        </label>
        <Input
          value={country}
          onChange={(event) => setCountry(event.target.value)}
          placeholder='Country code or name'
          className='h-8 w-48'
        />
      </div>
      <div className='grid gap-1.5'>
        <label className='text-xs font-medium text-muted-foreground'>
          Available
        </label>
        <Select value={availableForHire} onValueChange={setAvailableForHire}>
          <SelectTrigger className='h-8 w-36'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All</SelectItem>
            <SelectItem value='true'>Yes</SelectItem>
            <SelectItem value='false'>No</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className='grid gap-1.5'>
        <label className='text-xs font-medium text-muted-foreground'>
          Verified
        </label>
        <Select value={verified} onValueChange={setVerified}>
          <SelectTrigger className='h-8 w-36'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All</SelectItem>
            <SelectItem value='true'>Yes</SelectItem>
            <SelectItem value='false'>No</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type='button' size='sm' onClick={applyFilters}>
        Apply
      </Button>
      <Button type='button' size='sm' variant='ghost' onClick={resetFilters}>
        Reset
      </Button>
    </div>
  )
}

function readString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function readBooleanFilter(value: unknown): string {
  if (value === true) return 'true'
  if (value === false) return 'false'
  if (value === '"true"') return 'true'
  if (value === '"false"') return 'false'
  return value === 'true' || value === 'false' ? value : 'all'
}

function toBooleanSearchValue(value: string): boolean | undefined {
  if (value === 'true') return true
  if (value === 'false') return false
  return undefined
}
