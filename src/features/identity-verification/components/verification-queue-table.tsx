import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Check, Eye, X } from 'lucide-react'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api'
import { CapabilityGate } from '@/lib/capabilities'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Button } from '@/components/ui/button'
import {
  DataTableColumnHeader,
  getServerTableStatus,
  ServerDataTable,
  useServerTableState,
} from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { StatusPill } from '@/components/status-pill'
import { type NavigateFn } from '@/hooks/use-table-url-state'
import { useApproveVerification } from '../hooks/use-approve-verification'
import { useVerificationQueue } from '../hooks/use-verification-queue'
import {
  formatVerificationDateTime,
  getVerificationQueueItems,
  getVerificationQueueMeta,
  getVerificationStatusTone,
} from '../services/verification-query'
import type { ProfileVerification } from '../types'
import { RejectVerificationDialog } from './reject-verification-dialog'
import { VerificationDetailsDialog } from './verification-details-dialog'

type VerificationQueueTableProps = {
  navigate: NavigateFn
  search: Record<string, unknown>
}

export function VerificationQueueTable({
  navigate,
  search,
}: VerificationQueueTableProps) {
  const [detailsVerification, setDetailsVerification] =
    useState<ProfileVerification | null>(null)
  const [approveVerification, setApproveVerification] =
    useState<ProfileVerification | null>(null)
  const [rejectVerification, setRejectVerification] =
    useState<ProfileVerification | null>(null)
  const queueQuery = useVerificationQueue()
  const approveMutation = useApproveVerification()
  const items = getVerificationQueueItems(queueQuery.data?.data)
  const tableState = useServerTableState({
    navigate,
    pagination: {
      defaultPage: 1,
      defaultPageSize: 10,
      pageKey: 'page',
      pageSizeKey: 'take',
    },
    search,
    serverSearch: {
      enabled: false,
    },
  })

  async function approveSelectedVerification() {
    if (!approveVerification) return

    const approvePromise = approveMutation.mutateAsync({
      id: approveVerification.id,
    })

    toast.promise(approvePromise, {
      loading: 'Approving verification...',
      success: 'Verification approved.',
      error: getApiErrorMessage,
    })

    await approvePromise
    setApproveVerification(null)
  }

  return (
    <>
      <ServerDataTable
        columns={createVerificationColumns({
          isApproving: approveMutation.isPending,
          onApprove: setApproveVerification,
          onReject: setRejectVerification,
          onViewDetails: setDetailsVerification,
        })}
        data={items}
        emptyDescription='The backend returned no pending verification requests.'
        emptyTitle='No pending verifications'
        getRowId={(row) => row.id}
        meta={getVerificationQueueMeta(items)}
        state={tableState}
        status={getServerTableStatus({
          error: queueQuery.error,
          isFetching: queueQuery.isFetching,
          isLoading: queueQuery.isLoading,
          itemCount: items.length,
          refetch: queueQuery.refetch,
        })}
      />

      <VerificationDetailsDialog
        open={!!detailsVerification}
        verification={detailsVerification}
        onOpenChange={(open) => {
          if (!open) setDetailsVerification(null)
        }}
      />
      <RejectVerificationDialog
        open={!!rejectVerification}
        verification={rejectVerification}
        onOpenChange={(open) => {
          if (!open) setRejectVerification(null)
        }}
      />
      <ConfirmDialog
        open={!!approveVerification}
        onOpenChange={(open) => {
          if (!open) setApproveVerification(null)
        }}
        title='Approve verification'
        desc={
          approveVerification
            ? `Approve ${approveVerification.profileType} verification for user ${approveVerification.userId}?`
            : 'Approve this verification request?'
        }
        confirmText='Approve'
        isLoading={approveMutation.isPending}
        handleConfirm={() => {
          void approveSelectedVerification()
        }}
      />
    </>
  )
}

function createVerificationColumns({
  isApproving,
  onApprove,
  onReject,
  onViewDetails,
}: {
  isApproving: boolean
  onApprove: (verification: ProfileVerification) => void
  onReject: (verification: ProfileVerification) => void
  onViewDetails: (verification: ProfileVerification) => void
}): ColumnDef<ProfileVerification>[] {
  return [
    {
      accessorKey: 'profileType',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Profile' />
      ),
      cell: ({ row }) => (
        <div className='space-y-1 ps-3'>
          <div className='font-medium text-[var(--t1)]'>
            {row.original.profileType}
          </div>
          <LongText className='max-w-52 text-xs text-muted-foreground'>
            {row.original.id}
          </LongText>
        </div>
      ),
      enableHiding: false,
      enableSorting: false,
      meta: {
        className:
          'inset-s-0 ps-0.5 max-md:sticky @4xl/content:table-cell',
      },
    },
    {
      accessorKey: 'userId',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='User ID' />
      ),
      cell: ({ row }) => (
        <LongText className='max-w-52'>{row.original.userId}</LongText>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }) => (
        <StatusPill tone={getVerificationStatusTone(row.original.status)}>
          {row.original.status}
        </StatusPill>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'evidence',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Evidence' />
      ),
      cell: ({ row }) => (
        <LongText className='max-w-64'>
          {row.original.evidence || 'Not provided'}
        </LongText>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Requested' />
      ),
      cell: ({ row }) => (
        <span className='text-sm text-muted-foreground'>
          {formatVerificationDateTime(row.original.createdAt)}
        </span>
      ),
      enableSorting: false,
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className='flex justify-end gap-1'>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={() => onViewDetails(row.original)}
            aria-label={`View verification ${row.original.id}`}
          >
            <Eye className='size-4' />
          </Button>
          <CapabilityGate>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              disabled={isApproving}
              onClick={() => onApprove(row.original)}
              aria-label={`Approve verification ${row.original.id}`}
            >
              <Check className='size-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={() => onReject(row.original)}
              aria-label={`Reject verification ${row.original.id}`}
            >
              <X className='size-4' />
            </Button>
          </CapabilityGate>
        </div>
      ),
      enableHiding: false,
      enableSorting: false,
    },
  ]
}
