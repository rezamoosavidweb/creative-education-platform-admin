import { memo } from 'react'
import { ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { StatusPill } from '@/components/status-pill'

export const TwoFactorCard = memo(function TwoFactorCard() {
  return (
    <Card className='border border-[var(--bdr)] bg-[var(--sur)]'>
      <CardHeader>
        <CardTitle className='text-[var(--t1)]'>
          Two-Factor Authentication
        </CardTitle>
        <CardDescription className='text-[var(--t2)]'>
          Add an extra layer of security to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex items-center justify-between gap-4 rounded-lg border border-[var(--bdr)] bg-[var(--sur2)] p-4'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--oks)]'>
              <ShieldCheck className='h-5 w-5 text-[var(--ok)]' />
            </div>
            <div>
              <div className='flex items-center gap-2'>
                <span className='font-medium text-[var(--t1)]'>
                  Authenticator app
                </span>
                <StatusPill tone='ok'>Enabled</StatusPill>
              </div>
              <p className='text-[12.5px] text-[var(--t2)]'>
                Time-based one-time passwords (TOTP) via your authenticator app.
              </p>
            </div>
          </div>
          <Button variant='outline'>Manage 2FA</Button>
        </div>
      </CardContent>
    </Card>
  )
})
TwoFactorCard.displayName = 'TwoFactorCard'
