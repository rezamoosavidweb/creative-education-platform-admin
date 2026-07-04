import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getVenueLocation } from '../services/events-query'
import type { Venue } from '../types'

type VenuesTableProps = {
  venues: Venue[]
}

export function VenuesTable({ venues }: VenuesTableProps) {
  return (
    <div className='rounded-md border bg-[var(--sur)]'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Venue</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {venues.map((venue) => (
            <TableRow key={venue.id}>
              <TableCell className='font-medium'>{venue.name}</TableCell>
              <TableCell>{getVenueLocation(venue)}</TableCell>
              <TableCell>{venue.address ?? 'No address'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
