import { createFileRoute } from '@tanstack/react-router'
import { GlobalSearch } from '@/features/global-search'

export const Route = createFileRoute('/_authenticated/search/')({
  component: GlobalSearch,
})
