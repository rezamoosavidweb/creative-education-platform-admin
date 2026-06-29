import { memo } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { showSubmittedData } from '@/lib/show-submitted-data'

export const PasswordCard = memo(function PasswordCard() {
  return (
    <Card className='border border-[var(--bdr)] bg-[var(--sur)]'>
      <CardHeader>
        <CardTitle className='text-[var(--t1)]'>Password</CardTitle>
        <CardDescription className='text-[var(--t2)]'>
          Change the password used to sign in to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className='grid max-w-md gap-4'
          onSubmit={(event) => {
            event.preventDefault()
            showSubmittedData({ action: 'change-password' })
          }}
        >
          <div className='grid gap-1.5'>
            <Label htmlFor='current-password'>Current password</Label>
            <Input id='current-password' type='password' autoComplete='current-password' />
          </div>
          <div className='grid gap-1.5'>
            <Label htmlFor='new-password'>New password</Label>
            <Input id='new-password' type='password' autoComplete='new-password' />
          </div>
          <div className='grid gap-1.5'>
            <Label htmlFor='confirm-password'>Confirm new password</Label>
            <Input id='confirm-password' type='password' autoComplete='new-password' />
          </div>
          <div>
            <Button type='submit'>Update Password</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
})
PasswordCard.displayName = 'PasswordCard'
