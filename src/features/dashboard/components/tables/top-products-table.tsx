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
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead className='text-right'>Price</TableHead>
            <TableHead className='text-right'>Sales</TableHead>
            <TableHead className='text-right'>Revenue</TableHead>
            <TableHead className='text-right'>Trend</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((product) => (
            <TableRow key={product.id}>
              <TableCell className='font-medium'>{product.name}</TableCell>
              <TableCell className='text-sm text-muted-foreground'>
                {product.sku}
              </TableCell>
              <TableCell className='text-right'>
                ${product.price.toLocaleString()}
              </TableCell>
              <TableCell className='text-right'>{product.sales.toLocaleString()}</TableCell>
              <TableCell className='text-right'>
                ${product.revenue.toLocaleString()}
              </TableCell>
              <TableCell className='text-right'>
                <div className='flex items-center justify-end gap-1'>
                  {product.trend === 'up' ? (
                    <TrendingUp className='h-4 w-4 text-green-600' />
                  ) : (
                    <TrendingDown className='h-4 w-4 text-red-600' />
                  )}
                  <span
                    className={cn(
                      'text-sm font-medium',
                      product.trend === 'up' ? 'text-green-600' : 'text-red-600'
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
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
        <CardDescription>Your best performing products this month</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className='flex items-center justify-center py-8 text-sm text-destructive'>
            {error}
          </div>
        ) : isLoading ? (
          <div className='space-y-2'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className='h-10 animate-pulse rounded bg-muted' />
            ))}
          </div>
        ) : data.length > 0 ? (
          <TopProductsTableContent data={data} />
        ) : (
          <div className='flex items-center justify-center py-8 text-sm text-muted-foreground'>
            No products available
          </div>
        )}
      </CardContent>
    </Card>
  )
})
TopProductsTable.displayName = 'TopProductsTable'
