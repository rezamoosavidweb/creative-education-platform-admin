import { useEffect, useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { sidebarData } from './data/sidebar-data'
import { HeaderActions } from './header-actions'

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

function resolvePageTitle(pathname: string): string {
  if (pathname === '/') return 'Dashboard'
  for (const group of sidebarData.navGroups) {
    for (const item of group.items) {
      if ('url' in item && item.url === pathname) return item.title
    }
  }
  const segment = pathname.split('/').filter(Boolean).pop() ?? ''
  return segment
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function HeaderBreadcrumb() {
  const pathname = useLocation({ select: (location) => location.pathname })
  const title = resolvePageTitle(pathname)
  return (
    <nav aria-label='Breadcrumb' className='flex items-center gap-1.5 text-sm'>
      <Link
        to='/'
        className='text-[var(--t2)] transition-colors hover:text-[var(--t1)]'
      >
        Home
      </Link>
      <ChevronRight className='size-3.5 text-[var(--t3)]' />
      <span className='font-medium text-[var(--t1)]'>{title}</span>
    </nav>
  )
}

export function Header({ className, fixed, children, ...props }: HeaderProps) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }

    document.addEventListener('scroll', onScroll, { passive: true })
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'z-50 h-[52px] border-b border-[var(--bdr)] bg-[var(--sb)]',
        fixed && 'header-fixed peer/header sticky top-0 w-[inherit]',
        offset > 10 && fixed ? 'shadow' : 'shadow-none',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'relative flex h-full items-center gap-2 px-4',
          offset > 10 &&
            fixed &&
            'after:absolute after:inset-0 after:-z-10 after:bg-background/20 after:backdrop-blur-lg'
        )}
      >
        <SidebarTrigger className='-ms-1 text-[var(--t2)]' />
        <HeaderBreadcrumb />
        {children ?? <HeaderActions />}
      </div>
    </header>
  )
}
