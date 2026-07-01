import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ApiEmpty, ApiError, ApiLoading } from '@/components/api'
import { LongText } from '@/components/long-text'
import { usePortfolioItems } from '../hooks/use-portfolio-items'
import { formatProfileDateTime } from '../services/profiles-query'

export function PortfolioCard() {
  const portfolioQuery = usePortfolioItems()
  const items = portfolioQuery.data?.data ?? []

  return (
    <Card className='border border-[var(--bdr)] bg-[var(--sur)]'>
      <CardHeader>
        <CardTitle>Portfolio</CardTitle>
        <CardDescription>
          Published media items linked to this profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {portfolioQuery.isLoading && (
          <ApiLoading label='Loading portfolio...' />
        )}
        {portfolioQuery.error && (
          <ApiError
            error={portfolioQuery.error}
            onRetry={portfolioQuery.refetch}
          />
        )}
        {!portfolioQuery.isLoading &&
          !portfolioQuery.error &&
          items.length === 0 && (
            <ApiEmpty
              title='No portfolio items'
              description='This profile does not have portfolio items yet.'
            />
          )}
        {items.length > 0 && (
          <div className='divide-y divide-[var(--bdr)] rounded-lg border border-[var(--bdr)]'>
            {items.map((item) => (
              <div
                key={item.id}
                className='grid gap-2 p-4 sm:grid-cols-[1fr_auto]'
              >
                <div className='min-w-0 space-y-1'>
                  <div className='font-medium text-[var(--t1)]'>
                    {item.title ?? 'Untitled item'}
                  </div>
                  <LongText className='max-w-xl text-sm text-muted-foreground'>
                    {item.description ?? item.mediaId}
                  </LongText>
                </div>
                <div className='text-sm text-muted-foreground sm:text-end'>
                  <div>Position {item.position.toLocaleString()}</div>
                  <div>{formatProfileDateTime(item.updatedAt)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
