import { useEffect, type PropsWithChildren } from 'react'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { restoreSession } from './auth-service'

export function AuthRestoreGate({ children }: PropsWithChildren) {
  const status = useAuthStore((state) => state.auth.status)

  useEffect(() => {
    void restoreSession()
  }, [])

  if (status === 'restoring') {
    return (
      <div className='flex min-h-svh items-center justify-center bg-background text-muted-foreground'>
        <Loader2
          className='size-5 animate-spin'
          aria-label='Restoring session'
        />
      </div>
    )
  }

  return children
}
