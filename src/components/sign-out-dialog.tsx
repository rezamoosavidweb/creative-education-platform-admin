import { useNavigate, useLocation } from '@tanstack/react-router'
import { useLogout } from '@/lib/auth'
import { ConfirmDialog } from '@/components/confirm-dialog'

interface SignOutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const logoutMutation = useLogout()

  const handleSignOut = () => {
    const currentPath = location.href
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        onOpenChange(false)
        navigate({
          to: '/sign-in',
          search: { redirect: currentPath },
          replace: true,
        })
      },
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Sign out'
      desc='Are you sure you want to sign out? You will need to sign in again to access your account.'
      confirmText='Sign out'
      destructive
      handleConfirm={handleSignOut}
      isLoading={logoutMutation.isPending}
      className='sm:max-w-sm'
    />
  )
}
