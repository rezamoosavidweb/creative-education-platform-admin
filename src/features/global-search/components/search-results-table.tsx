import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusPill } from '@/components/status-pill'
import {
  formatSearchLocation,
  formatSearchRating,
  getSearchHitTags,
} from '../services/global-search-query'
import type { GlobalSearchHit } from '../types'

type SearchResultsTableProps = {
  hits: GlobalSearchHit[]
}

export function SearchResultsTable({ hits }: SearchResultsTableProps) {
  return (
    <div className='rounded-md border bg-[var(--sur)]'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Result</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className='text-end'>Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hits.map((hit) => (
            <TableRow key={`${hit.entityType}-${hit.entityId}`}>
              <TableCell className='min-w-[260px] whitespace-normal'>
                <div className='font-medium'>{hit.title}</div>
                <div className='text-xs text-muted-foreground'>
                  {hit.subtitle ?? hit.handle ?? hit.entityId}
                </div>
              </TableCell>
              <TableCell>
                <StatusPill tone={hit.verified ? 'ok' : 'neutral'}>
                  {hit.entityType}
                </StatusPill>
              </TableCell>
              <TableCell>{formatSearchLocation(hit)}</TableCell>
              <TableCell>{formatSearchRating(hit)}</TableCell>
              <TableCell className='max-w-[320px] text-xs whitespace-normal text-muted-foreground'>
                {getSearchHitTags(hit).join(', ') || 'n/a'}
              </TableCell>
              <TableCell className='text-end'>{hit.score.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
