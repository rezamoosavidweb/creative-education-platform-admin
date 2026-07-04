import { useQuery } from '@tanstack/react-query'
import {
  searchControllerAutocomplete,
  searchControllerSearch,
  searchControllerSuggestions,
} from '@/lib/api/generated/endpoints/search/search'
import type { GlobalSearchParams } from '../types'

export const globalSearchQueryKeys = {
  autocomplete: (text: string) =>
    ['global-search', 'autocomplete', text] as const,
  results: (params: GlobalSearchParams | null) =>
    ['global-search', 'results', params] as const,
  suggestions: (text: string) =>
    ['global-search', 'suggestions', text] as const,
}

export function useGlobalSearch(params: GlobalSearchParams | null) {
  return useQuery({
    enabled: Boolean(params),
    queryFn: ({ signal }) =>
      searchControllerSearch(params ?? undefined, undefined, signal),
    queryKey: globalSearchQueryKeys.results(params),
  })
}

export function useGlobalAutocomplete(text: string) {
  const enabled = text.trim().length >= 2

  return useQuery({
    enabled,
    queryFn: ({ signal }) =>
      searchControllerAutocomplete(
        { limit: 5, text: text.trim() },
        undefined,
        signal
      ),
    queryKey: globalSearchQueryKeys.autocomplete(text.trim()),
  })
}

export function useGlobalTermSuggestions(text: string) {
  const enabled = text.trim().length >= 2

  return useQuery({
    enabled,
    queryFn: ({ signal }) =>
      searchControllerSuggestions(
        { limit: 5, text: text.trim() },
        undefined,
        signal
      ),
    queryKey: globalSearchQueryKeys.suggestions(text.trim()),
  })
}
