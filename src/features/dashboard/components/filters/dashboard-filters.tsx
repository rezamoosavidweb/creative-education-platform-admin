import { memo, useCallback } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { DashboardFilter } from '../../types/dashboard'

const SEGMENTS = [
  { value: 'all', label: 'All Segments' },
  { value: 'free', label: 'Free' },
  { value: 'premium', label: 'Premium' },
  { value: 'enterprise', label: 'Enterprise' },
]

const REGIONS = [
  { value: 'all', label: 'All Regions' },
  { value: 'us', label: 'United States' },
  { value: 'eu', label: 'Europe' },
  { value: 'asia', label: 'Asia Pacific' },
]

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'software', label: 'Software' },
  { value: 'hardware', label: 'Hardware' },
  { value: 'services', label: 'Services' },
]

type DashboardFiltersProps = {
  filters: DashboardFilter
  onFiltersChange: (filters: DashboardFilter) => void
  isLoading?: boolean
}

export const DashboardFilters = memo(function DashboardFilters({
  filters,
  onFiltersChange,
  isLoading = false,
}: DashboardFiltersProps) {
  const handleSegmentChange = useCallback(
    (segment: string) => {
      onFiltersChange({ ...filters, segment })
    },
    [filters, onFiltersChange]
  )

  const handleRegionChange = useCallback(
    (region: string) => {
      onFiltersChange({ ...filters, region })
    },
    [filters, onFiltersChange]
  )

  const handleCategoryChange = useCallback(
    (category: string) => {
      onFiltersChange({ ...filters, productCategory: category })
    },
    [filters, onFiltersChange]
  )

  return (
    <div className='flex flex-wrap gap-2'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            disabled={isLoading}
            className='gap-1'
          >
            Segment: {filters.segment || 'All'}
            <ChevronDown className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' className='w-56'>
          <DropdownMenuLabel>Select Segment</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {SEGMENTS.map((segment) => (
            <DropdownMenuCheckboxItem
              key={segment.value}
              checked={filters.segment === segment.value}
              onCheckedChange={() => handleSegmentChange(segment.value)}
            >
              {segment.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            disabled={isLoading}
            className='gap-1'
          >
            Region: {filters.region || 'All'}
            <ChevronDown className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' className='w-56'>
          <DropdownMenuLabel>Select Region</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {REGIONS.map((region) => (
            <DropdownMenuCheckboxItem
              key={region.value}
              checked={filters.region === region.value}
              onCheckedChange={() => handleRegionChange(region.value)}
            >
              {region.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            disabled={isLoading}
            className='gap-1'
          >
            Category: {filters.productCategory || 'All'}
            <ChevronDown className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' className='w-56'>
          <DropdownMenuLabel>Select Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {CATEGORIES.map((category) => (
            <DropdownMenuCheckboxItem
              key={category.value}
              checked={filters.productCategory === category.value}
              onCheckedChange={() => handleCategoryChange(category.value)}
            >
              {category.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
})
DashboardFilters.displayName = 'DashboardFilters'
