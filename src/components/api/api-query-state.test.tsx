import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { ApiQueryState } from './api-query-state'

describe('ApiQueryState', () => {
  it('renders loading, error, empty, and content states', () => {
    expect(
      renderToStaticMarkup(
        <ApiQueryState
          emptyTitle='Empty'
          error={null}
          hasData={false}
          isError={false}
          isLoading
          loadingLabel='Loading records...'
          onRetry={vi.fn()}
        >
          Content
        </ApiQueryState>
      )
    ).toContain('Loading records...')

    expect(
      renderToStaticMarkup(
        <ApiQueryState
          emptyTitle='Empty'
          error={new Error('Broken')}
          hasData={false}
          isError
          isLoading={false}
          loadingLabel='Loading records...'
          onRetry={vi.fn()}
        >
          Content
        </ApiQueryState>
      )
    ).toContain('Unable to load data')

    expect(
      renderToStaticMarkup(
        <ApiQueryState
          emptyTitle='Empty'
          error={null}
          hasData={false}
          isError={false}
          isLoading={false}
          loadingLabel='Loading records...'
          onRetry={vi.fn()}
        >
          Content
        </ApiQueryState>
      )
    ).toContain('Empty')

    expect(
      renderToStaticMarkup(
        <ApiQueryState
          emptyTitle='Empty'
          error={null}
          hasData
          isError={false}
          isLoading={false}
          loadingLabel='Loading records...'
          onRetry={vi.fn()}
        >
          Content
        </ApiQueryState>
      )
    ).toContain('Content')
  })
})
