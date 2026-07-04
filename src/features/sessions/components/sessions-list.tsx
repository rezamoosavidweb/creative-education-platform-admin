import { memo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { KeyRound, Monitor, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api'
import { CapabilityGate } from '@/lib/capabilities'
import { type NavigateFn } from '@/hooks/use-table-url-state'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/confirm-dialog'
import {
  DataTableColumnHeader,
  getServerTableStatus,
  ServerDataTable,
  useServerTableState,
} from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { StatusPill } from '@/components/status-pill'
import { useActiveSessionsList } from '../hooks/use-active-sessions'
import { useRevokeActiveSession } from '../hooks/use-revoke-session'
import {
  formatSessionDateTime,
  getActiveSessionItems,
  getActiveSessionsTableMeta,
  getReliableCurrentSessionId,
} from '../services/sessions-query'
import type { AdminSession } from '../types'

type SessionsListProps = {
  navigate: NavigateFn
  search: Record<string, unknown>
}

export const SessionsList = memo(function SessionsList({
  navigate,
  search,
}: SessionsListProps) {
  const [pendingRevokeSession, setPendingRevokeSession] =
    useState<AdminSession | null>(null)
  const sessionsQuery = useActiveSessionsList()
  const revokeMutation = useRevokeActiveSession()
  const sessions = getActiveSessionItems(sessionsQuery.data?.data)
  const currentSessionId = getReliableCurrentSessionId(sessions)
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

  async function revokeSelectedSession() {
    if (!pendingRevokeSession) return

    const revokePromise = revokeMutation.mutateAsync({
      sessionId: pendingRevokeSession.id,
    })

    toast.promise(revokePromise, {
      loading: 'Revoking session...',
      success: 'Session revoked.',
      error: getApiErrorMessage,
    })

    await revokePromise
    setPendingRevokeSession(null)
  }

  return (
    <>
      <ServerDataTable
        columns={createSessionColumns({
          currentSessionId,
          isRevoking: revokeMutation.isPending,
          onRevoke: setPendingRevokeSession,
        })}
        data={sessions}
        emptyDescription='The backend returned no active sessions.'
        emptyTitle='No active sessions'
        getRowId={(row) => row.id}
        meta={getActiveSessionsTableMeta(sessions)}
        state={tableState}
        status={getServerTableStatus({
          error: sessionsQuery.error,
          isFetching: sessionsQuery.isFetching,
          isLoading: sessionsQuery.isLoading,
          itemCount: sessions.length,
          refetch: sessionsQuery.refetch,
        })}
      />

      <ConfirmDialog
        open={!!pendingRevokeSession}
        onOpenChange={(open) => {
          if (!open) setPendingRevokeSession(null)
        }}
        title='Revoke session'
        desc={
          pendingRevokeSession
            ? `Revoke session ${pendingRevokeSession.id}?`
            : 'Revoke this active session?'
        }
        confirmText='Revoke'
        destructive
        isLoading={revokeMutation.isPending}
        handleConfirm={() => {
          void revokeSelectedSession()
        }}
      />
    </>
  )
})
SessionsList.displayName = 'SessionsList'

function createSessionColumns({
  currentSessionId,
  isRevoking,
  onRevoke,
}: {
  currentSessionId: string | null
  isRevoking: boolean
  onRevoke: (session: AdminSession) => void
}): ColumnDef<AdminSession>[] {
  return [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Session' />
      ),
      cell: ({ row }) => (
        <div className='flex items-center gap-3 ps-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--sur3)]'>
            <Monitor className='h-5 w-5 text-[var(--t2)]' />
          </div>
          <div className='min-w-0 space-y-1'>
            <div className='flex flex-wrap items-center gap-2'>
              <LongText className='max-w-64 font-medium text-[var(--t1)]'>
                {row.original.id}
              </LongText>
              {row.original.id === currentSessionId && (
                <StatusPill tone='primary'>This session</StatusPill>
              )}
            </div>
            <span className='text-[12.5px] text-muted-foreground'>
              Refresh-token lineage
            </span>
          </div>
        </div>
      ),
      enableHiding: false,
      enableSorting: false,
      meta: {
        className: 'inset-s-0 ps-0.5 max-md:sticky @4xl/content:table-cell',
      },
    },
    {
      id: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: () => <StatusPill tone='ok'>Active</StatusPill>,
      enableHiding: false,
      enableSorting: false,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Created' />
      ),
      cell: ({ row }) => (
        <span className='text-sm text-muted-foreground'>
          {formatSessionDateTime(row.original.createdAt)}
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'expiresAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Expires' />
      ),
      cell: ({ row }) => (
        <span className='text-sm text-muted-foreground'>
          {formatSessionDateTime(row.original.expiresAt)}
        </span>
      ),
      enableSorting: false,
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <CapabilityGate>
          <Button
            type='button'
            variant='outline'
            size='sm'
            disabled={isRevoking || row.original.id === currentSessionId}
            onClick={() => onRevoke(row.original)}
            className='border-[var(--err)]/40 text-[var(--err)] hover:bg-[var(--errs)] hover:text-[var(--err)]'
          >
            {isRevoking ? (
              <KeyRound className='size-4' />
            ) : (
              <Trash2 className='size-4' />
            )}
            Revoke
          </Button>
        </CapabilityGate>
      ),
      enableHiding: false,
      enableSorting: false,
    },
  ]
}
