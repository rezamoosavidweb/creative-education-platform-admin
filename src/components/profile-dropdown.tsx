import { Link } from '@tanstack/react-router'
import { ChevronDown } from 'lucide-react'
import {
  getAuthUserDisplayName,
  getAuthUserEmail,
  getAuthUserInitials,
  getAuthUserRoleLabel,
  useCurrentUser,
} from '@/lib/auth'
import useDialogState from '@/hooks/use-dialog-state'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SignOutDialog } from '@/components/sign-out-dialog'

export function ProfileDropdown() {
  const [open, setOpen] = useDialogState()
  const user = useCurrentUser()
  const displayName = getAuthUserDisplayName(user)
  const email = getAuthUserEmail(user)
  const role = getAuthUserRoleLabel(user)
  const initials = getAuthUserInitials(user)

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type='button'
            className='flex items-center gap-2 rounded-lg p-1 ps-1.5 transition-colors hover:bg-[var(--sur3)]'
          >
            <span
              className='flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white'
              style={{
                backgroundImage:
                  'linear-gradient(135deg, var(--pri) 0%, #0ea5c8 100%)',
              }}
            >
              {initials}
            </span>
            <span className='hidden text-start leading-tight sm:block'>
              <span className='block text-[12.5px] font-semibold text-[var(--t1)]'>
                {displayName}
              </span>
              <span className='block text-[11px] text-[var(--t3)]'>{role}</span>
            </span>
            <ChevronDown className='hidden h-3.5 w-3.5 text-[var(--t3)] sm:block' />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col gap-1.5'>
              <p className='text-sm leading-none font-medium'>{displayName}</p>
              <p className='text-xs leading-none text-muted-foreground'>
                {email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to='/settings'>
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to='/settings'>
                Billing
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to='/settings'>
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>New Team</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive' onClick={() => setOpen(true)}>
            Sign out
            <DropdownMenuShortcut className='text-current'>
              ⇧⌘Q
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  )
}
