import { Bell, Check, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

const NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'Sarah Chen joined the workspace',
    time: '24m ago',
  },
  {
    id: 'n2',
    title: 'Invoice INV-2026-06 was paid',
    time: '9h ago',
  },
  {
    id: 'n3',
    title: 'File Storage latency degraded',
    time: 'Yesterday',
  },
]

const LOCALES = ['English', 'Español', 'Deutsch', 'Français']

function NotificationsButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='relative size-8 text-[var(--t2)]'
          aria-label='Notifications'
        >
          <Bell className='size-[18px]' />
          <span className='absolute top-1 right-1 flex h-[15px] min-w-[15px] items-center justify-center rounded-full border-2 border-[var(--sb)] bg-[var(--err)] px-1 text-[9px] font-bold text-white'>
            3
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-80'>
        <div className='flex items-center justify-between px-2 py-1.5'>
          <span className='text-sm font-semibold'>Notifications</span>
          <button
            type='button'
            className='text-xs text-[var(--pri)] hover:underline'
          >
            Mark all read
          </button>
        </div>
        <DropdownMenuSeparator />
        {NOTIFICATIONS.map((n) => (
          <DropdownMenuItem key={n.id} className='flex flex-col items-start gap-0.5'>
            <span className='text-[13px] text-[var(--t1)]'>{n.title}</span>
            <span className='text-[11px] text-[var(--t3)]'>{n.time}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function LocaleButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='size-8 text-[var(--t2)]'
          aria-label='Change language'
        >
          <Globe className='size-[18px]' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-40'>
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LOCALES.map((locale, index) => (
          <DropdownMenuItem key={locale} className='justify-between'>
            {locale}
            {index === 0 && <Check className='size-4 text-[var(--pri)]' />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function HeaderActions() {
  return (
    <div className='ms-auto flex items-center gap-1 sm:gap-1.5'>
      <Search className='w-40 flex-none lg:w-56' />
      <NotificationsButton />
      <ThemeSwitch />
      <LocaleButton />
      <ProfileDropdown />
    </div>
  )
}
