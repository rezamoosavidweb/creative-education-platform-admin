import type {
  SearchControllerAutocompleteParams,
  SearchControllerSearchParams,
  SearchControllerSuggestionsParams,
  SearchEntityType,
  SearchHitDto,
  SearchResultDto,
  SearchSort,
  SuggestionDto,
  TermSuggestionDto,
} from '@/lib/api/generated/model'

export type GlobalSearchParams = SearchControllerSearchParams
export type AutocompleteParams = SearchControllerAutocompleteParams
export type TermSuggestionsParams = SearchControllerSuggestionsParams
export type GlobalSearchResult = SearchResultDto
export type GlobalSearchHit = SearchHitDto
export type GlobalSearchSuggestion = SuggestionDto
export type GlobalSearchTermSuggestion = TermSuggestionDto
export type GlobalSearchEntityType = SearchEntityType
export type GlobalSearchSort = SearchSort
