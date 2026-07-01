import { useServerQuery } from '@/lib/query'

export function usePortfolioItems() {
  return useServerQuery({
    request: {
      path: '/profiles/me/portfolio',
      method: 'get',
    },
  })
}
