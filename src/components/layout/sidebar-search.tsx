import { Search as SearchIcon } from 'lucide-react'
import { useSearch } from '@/context/search-provider'

export function SidebarSearch() {
  const { setOpen } = useSearch()
  return (
    <button
      type='button'
      onClick={() => setOpen(true)}
      aria-keyshortcuts='Meta+K Control+K'
      className='flex w-full items-center gap-2 rounded-md border border-[var(--bdr)] bg-[var(--sur2)] px-2.5 py-[7px] text-start transition-colors hover:bg-[var(--sur3)] group-data-[collapsible=icon]:hidden'
    >
      <SearchIcon className='h-[13px] w-[13px] shrink-0 text-[var(--t3)]' />
      <span className='flex-1 text-[13px] text-[var(--t3)]'>Search…</span>
      <kbd className='rounded border border-[var(--bdr2)] bg-[var(--sur3)] px-1.5 py-px text-[11px] text-[var(--t3)]'>
        ⌘K
      </kbd>
    </button>
  )
}
