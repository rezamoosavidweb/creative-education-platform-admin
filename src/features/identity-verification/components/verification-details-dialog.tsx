import type { ReactNode } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { StatusPill } from '@/components/status-pill'
import {
  formatVerificationDateTime,
  getVerificationStatusTone,
} from '../services/verification-query'
import type { ProfileVerification } from '../types'

type VerificationDetailsDialogProps = {
  onOpenChange: (open: boolean) => void
  open: boolean
  verification: ProfileVerification | null
}

export function VerificationDetailsDialog({
  onOpenChange,
  open,
  verification,
}: VerificationDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-3xl'>
        <DialogHeader>
          <DialogTitle>Verification details</DialogTitle>
          <DialogDescription>
            Backend profile verification record.
          </DialogDescription>
        </DialogHeader>
        {verification && (
          <div className='grid gap-4 sm:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Request</CardTitle>
                <CardDescription>
                  Identity fields exposed by the backend DTO.
                </CardDescription>
              </CardHeader>
              <CardContent className='grid gap-3'>
                <DetailItem label='Verification ID'>
                  {verification.id}
                </DetailItem>
                <DetailItem label='User ID'>{verification.userId}</DetailItem>
                <DetailItem label='Profile type'>
                  {verification.profileType}
                </DetailItem>
                <DetailItem label='Status'>
                  <StatusPill
                    tone={getVerificationStatusTone(verification.status)}
                  >
                    {verification.status}
                  </StatusPill>
                </DetailItem>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Review</CardTitle>
                <CardDescription>
                  Evidence and reviewer note currently exposed.
                </CardDescription>
              </CardHeader>
              <CardContent className='grid gap-3'>
                <DetailItem label='Evidence'>
                  {verification.evidence || 'Not provided'}
                </DetailItem>
                <DetailItem label='Review note'>
                  {verification.reviewNote || 'Not provided'}
                </DetailItem>
                <DetailItem label='Created'>
                  {formatVerificationDateTime(verification.createdAt)}
                </DetailItem>
                <DetailItem label='Updated'>
                  {formatVerificationDateTime(verification.updatedAt)}
                </DetailItem>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function DetailItem({
  children,
  label,
}: {
  children: ReactNode
  label: string
}) {
  return (
    <div className='space-y-1 rounded-md border bg-[var(--sur)] p-3'>
      <div className='text-xs font-medium text-muted-foreground'>{label}</div>
      <div className='text-sm break-words text-[var(--t1)]'>{children}</div>
    </div>
  )
}
