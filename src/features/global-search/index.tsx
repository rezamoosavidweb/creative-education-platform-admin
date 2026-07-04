import { useMemo, useState } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ApiEmpty,
  ApiError,
  ApiLoading,
  CursorPagination,
} from '@/components/api'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { SearchResultsTable } from './components/search-results-table'
import {
  useGlobalAutocomplete,
  useGlobalSearch,
  useGlobalTermSuggestions,
} from './hooks/use-global-search-queries'
import {
  GLOBAL_SEARCH_ENTITY_TYPES,
  GLOBAL_SEARCH_SORTS,
  normalizeFacetBuckets,
  normalizeSearchHits,
  parseCsv,
} from './services/global-search-query'
import type {
  GlobalSearchEntityType,
  GlobalSearchParams,
  GlobalSearchSort,
} from './types'

const ANY = 'ANY'

export function GlobalSearch() {
  const [text, setText] = useState('')
  const [type, setType] = useState<GlobalSearchEntityType | typeof ANY>(ANY)
  const [sort, setSort] = useState<GlobalSearchSort>('RELEVANCE')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [verified, setVerified] = useState<typeof ANY | 'true' | 'false'>(ANY)
  const [availableForHire, setAvailableForHire] = useState<
    typeof ANY | 'true' | 'false'
  >(ANY)
  const [tagCsv, setTagCsv] = useState('')
  const [params, setParams] = useState<GlobalSearchParams | null>(null)
  const debouncedText = useDebouncedValue(text, 300)

  const searchQuery = useGlobalSearch(params)
  const autocompleteQuery = useGlobalAutocomplete(debouncedText)
  const suggestionsQuery = useGlobalTermSuggestions(debouncedText)

  const facetSummary = useMemo(() => {
    const facets = searchQuery.data?.facets
    if (!facets) return []

    return [
      ...normalizeFacetBuckets(facets.entityType).map(
        (facet) => ['Type', facet] as const
      ),
      ...normalizeFacetBuckets(facets.country).map(
        (facet) => ['Country', facet] as const
      ),
      ...normalizeFacetBuckets(facets.kinds).map(
        (facet) => ['Kind', facet] as const
      ),
      ...normalizeFacetBuckets(facets.disciplines).map(
        (facet) => ['Discipline', facet] as const
      ),
    ].slice(0, 12)
  }, [searchQuery.data?.facets])

  const hits = normalizeSearchHits(searchQuery.data?.hits ?? [])

  const buildParams = (cursor?: string | null): GlobalSearchParams => ({
    availableForHire:
      availableForHire === ANY ? undefined : availableForHire === 'true',
    city: city || undefined,
    country: country || undefined,
    cursor: cursor || undefined,
    disciplineIds: parseCsv(tagCsv),
    limit: 10,
    sort,
    text: text || undefined,
    types: type === ANY ? undefined : [type],
    verified: verified === ANY ? undefined : verified === 'true',
  })

  const runSearch = () => setParams(buildParams())
  const loadNext = (cursor: string) => setParams(buildParams(cursor))

  return (
    <>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Search</h2>
          <p className='text-muted-foreground'>
            Query the backend search index across profiles, organizations,
            events, jobs, services, and courses.
          </p>
        </div>

        <div className='grid gap-3 rounded-md border border-[var(--bdr)] bg-[var(--sur)] p-4 xl:grid-cols-[minmax(220px,1.6fr)_180px_160px_140px_140px_auto] xl:items-end'>
          <div className='grid gap-2'>
            <Label htmlFor='global-search-text'>Text</Label>
            <Input
              id='global-search-text'
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder='Search text'
            />
          </div>
          <div className='grid gap-2'>
            <Label>Type</Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as typeof type)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Any</SelectItem>
                {GLOBAL_SEARCH_ENTITY_TYPES.map((entityType) => (
                  <SelectItem key={entityType} value={entityType}>
                    {entityType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='grid gap-2'>
            <Label>Sort</Label>
            <Select
              value={sort}
              onValueChange={(value) => setSort(value as GlobalSearchSort)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GLOBAL_SEARCH_SORTS.map((sortValue) => (
                  <SelectItem key={sortValue} value={sortValue}>
                    {sortValue}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <BooleanSelect
            label='Verified'
            value={verified}
            onChange={setVerified}
          />
          <BooleanSelect
            label='For hire'
            value={availableForHire}
            onChange={setAvailableForHire}
          />
          <Button onClick={runSearch}>
            <SearchIcon className='size-4' />
            Search
          </Button>
        </div>

        <div className='grid gap-3 sm:grid-cols-3'>
          <Input
            aria-label='Country'
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            placeholder='Country'
          />
          <Input
            aria-label='City'
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder='City'
          />
          <Input
            aria-label='Discipline IDs'
            value={tagCsv}
            onChange={(event) => setTagCsv(event.target.value)}
            placeholder='Discipline IDs, comma separated'
          />
        </div>

        <div className='grid gap-3 lg:grid-cols-2'>
          <SuggestionList
            title='Autocomplete'
            items={(autocompleteQuery.data ?? []).map(
              (item) => `${item.entityType}: ${item.title}`
            )}
          />
          <SuggestionList
            title='Terms'
            items={(suggestionsQuery.data ?? []).map((item) => item.text)}
          />
        </div>

        {!params && (
          <ApiEmpty
            title='No search run'
            description='Set filters and run a backend search.'
          />
        )}
        {params && searchQuery.isLoading && (
          <ApiLoading label='Searching index...' />
        )}
        {params && searchQuery.isError && (
          <ApiError
            error={searchQuery.error}
            onRetry={() => void searchQuery.refetch()}
          />
        )}
        {params && searchQuery.data && hits.length === 0 && (
          <ApiEmpty
            title='No results'
            description='The backend returned no search hits for the current filters.'
          />
        )}
        {params && searchQuery.data && hits.length > 0 && (
          <div className='grid gap-4'>
            <div className='flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground'>
              <span>{searchQuery.data.total} total results</span>
              <div className='flex flex-wrap gap-2'>
                {facetSummary.map(([label, facet]) => (
                  <span
                    key={`${label}-${facet.value}`}
                    className='rounded-md border border-[var(--bdr)] px-2 py-1'
                  >
                    {label}: {facet.value} ({facet.count})
                  </span>
                ))}
              </div>
            </div>
            <SearchResultsTable hits={hits} />
            <CursorPagination
              hasNextPage={Boolean(searchQuery.data.nextCursor)}
              isRefreshing={searchQuery.isFetching}
              nextCursor={searchQuery.data.nextCursor ?? null}
              onNext={loadNext}
              onRefresh={() => void searchQuery.refetch()}
            />
          </div>
        )}
      </Main>
    </>
  )
}

function BooleanSelect({
  label,
  onChange,
  value,
}: {
  label: string
  onChange: (value: typeof ANY | 'true' | 'false') => void
  value: typeof ANY | 'true' | 'false'
}) {
  return (
    <div className='grid gap-2'>
      <Label>{label}</Label>
      <Select
        value={value}
        onValueChange={(next) => onChange(next as typeof value)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>Any</SelectItem>
          <SelectItem value='true'>Yes</SelectItem>
          <SelectItem value='false'>No</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

function SuggestionList({ items, title }: { items: string[]; title: string }) {
  return (
    <div className='rounded-md border border-[var(--bdr)] bg-[var(--sur)] p-4'>
      <h3 className='text-sm font-semibold'>{title}</h3>
      {items.length === 0 ? (
        <p className='mt-2 text-sm text-muted-foreground'>No suggestions</p>
      ) : (
        <div className='mt-2 flex flex-wrap gap-2'>
          {items.map((item) => (
            <span
              key={item}
              className='rounded-md border border-[var(--bdr)] px-2 py-1 text-sm'
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
