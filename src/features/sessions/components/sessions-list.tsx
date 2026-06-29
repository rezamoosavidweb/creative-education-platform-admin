import { memo } from 'react'
import { Monitor, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StatusPill } from '@/components/status-pill'
import { type Session, type SessionDevice } from '../data/sessions'

type SessionsListProps = {
  sessions: Session[]
}

const DEVICE_ICON: Record<SessionDevice, typeof Monitor> = {
  monitor: Monitor,
  smartphone: Smartphone,
}

export const SessionsList = memo(function SessionsList({
  sessions,
}: SessionsListProps) {
  return (
    <Card className='border border-[var(--bdr)] bg-[var(--sur)]'>
      <CardContent className='p-0'>
        <ul>
          {sessions.map((session) => {
            const Icon = DEVICE_ICON[session.icon]
            return (
              <li
                key={session.id}
                className='flex items-center justify-between gap-4 border-b border-[var(--bdr)] px-5 py-4 last:border-b-0'
              >
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--sur3)]'>
                    <Icon className='h-5 w-5 text-[var(--t2)]' />
                  </div>
                  <div>
                    <div className='flex items-center gap-2'>
                      <span className='font-medium text-[var(--t1)]'>
                        {session.device}
                      </span>
                      {session.current && (
                        <StatusPill tone='primary'>This device</StatusPill>
                      )}
                    </div>
                    <p className='text-[12.5px] text-[var(--t2)]'>
                      {session.location} · {session.ip} · {session.lastActive}
                    </p>
                  </div>
                </div>
                {!session.current && (
                  <Button
                    variant='outline'
                    className='border-[var(--err)]/40 text-[var(--err)] hover:bg-[var(--errs)] hover:text-[var(--err)]'
                  >
                    Revoke
                  </Button>
                )}
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
})
SessionsList.displayName = 'SessionsList'
