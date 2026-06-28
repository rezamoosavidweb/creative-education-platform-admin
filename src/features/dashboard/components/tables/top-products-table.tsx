import { memo } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Product } from '../../types/dashboard'

type TopProductsTableProps = {
  data: Product[]
  isLoading?: boolean
  error?: string | null
}

function TopProductsTableContent({ data }: { data: Product[] }) {
  return (
    <div className='overflow-x-auto'>
      <Table>
        <TableHeader>
          <TableRow className='border-[var(--bdr)]'>
            <TableHead className='text-[var(--t2)]'>Product</TableHead>
            <TableHead className='text-[var(--t2)]'>SKU</TableHead>
            <TableHead className='text-right text-[var(--t2)]'>Price</TableHead>
            <TableHead className='text-right text-[var(--t2)]'>Sales</TableHead>
            <TableHead className='text-right text-[var(--t2)]'>Revenue</TableHead>
            <TableHead className='text-right text-[var(--t2)]'>Trend</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((product) => (
            <TableRow key={product.id} className='border-[var(--bdr)] hover:bg-[var(--sur2)]'>
              <TableCell className='font-medium text-[var(--t1)]'>{product.name}</TableCell>
              <TableCell className='text-sm text-[var(--t2)]'>
                {product.sku}
              </TableCell>
              <TableCell className='text-right text-[var(--t1)]'>
                ${product.price.toLocaleString()}
              </TableCell>
              <TableCell className='text-right text-[var(--t1)]'>{product.sales.toLocaleString()}</TableCell>
              <TableCell className='text-right text-[var(--t1)]'>
                ${product.revenue.toLocaleString()}
              </TableCell>
              <TableCell className='text-right'>
                <div className='flex items-center justify-end gap-1'>
                  {product.trend === 'up' ? (
                    <TrendingUp className='h-4 w-4 text-[var(--ok)]' />
                  ) : (
                    <TrendingDown className='h-4 w-4 text-[var(--err)]' />
                  )}
                  <span
                    className={cn(
                      'text-sm font-medium',
                      product.trend === 'up' ? 'text-[var(--ok)]' : 'text-[var(--err)]'
                    )}
                  >
                    {product.trend === 'up' ? '+' : '-'}12%
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export const TopProductsTable = memo(function TopProductsTable({
  data,
  isLoading = false,
  error,
}: TopProductsTableProps) {
  return (
    <Card className='border-[var(--bdr)] bg-[var(--sur)]'>
      <CardHeader>
        <CardTitle className='text-[var(--t1)]'>Top Products</CardTitle>
        <CardDescription className='text-[var(--t2)]'>
          Your best performing products this month
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className='flex items-center justify-center py-8 text-sm text-[var(--err)]'>
            {error}
          </div>
        ) : isLoading ? (
          <div className='space-y-2'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className='h-10 animate-pulse rounded bg-[var(--sur2)]' />
            ))}
          </div>
        ) : data.length > 0 ? (
          <TopProductsTableContent data={data} />
        ) : (
          <div className='flex items-center justify-center py-8 text-sm text-[var(--t3)]'>
            No products available
          </div>
        )}
      </CardContent>
    </Card>
  )
})
TopProductsTable.displayName = 'TopProductsTable'
