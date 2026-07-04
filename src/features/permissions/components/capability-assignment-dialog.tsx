import { useEffect, useMemo, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, ShieldPlus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api'
import { getAuthUserDisplayName, getAuthUserEmail } from '@/lib/auth'
import { CapabilityGate } from '@/lib/capabilities'
import { useApiForm } from '@/lib/forms'
import { Button } from '@/components/ui/button'
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ApiEmpty, ApiError, ApiLoading } from '@/components/api'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useGrantCapability } from '../hooks/use-grant-capability'
import { useRevokeCapability } from '../hooks/use-revoke-capability'
import { useUserCapabilities } from '../hooks/use-user-capabilities'
import {
  CAPABILITY_MANAGE_CAPABILITY,
  getUserCapabilityKeys,
  groupCapabilities,
} from '../services/capabilities-query'
import type {
  CapabilityGroup,
  CapabilityKey,
  CapabilityUser,
  GrantCapabilityRequest,
} from '../types'

const grantCapabilitySchema = z.object({
  capability: z.string().trim().min(1, 'Enter a backend capability key.'),
})

type CapabilityAssignmentDialogProps = {
  onOpenChange: (open: boolean) => void
  open: boolean
  user: CapabilityUser | null
}

export function CapabilityAssignmentDialog({
  onOpenChange,
  open,
  user,
}: CapabilityAssignmentDialogProps) {
  const [pendingRevoke, setPendingRevoke] = useState<CapabilityKey | null>(null)
  const capabilitiesQuery = useUserCapabilities(user?.id ?? null)
  const grantMutation = useGrantCapability()
  const revokeMutation = useRevokeCapability()
  const capabilities = useMemo(
    () => getUserCapabilityKeys(capabilitiesQuery.data?.data),
    [capabilitiesQuery.data?.data]
  )
  const groups = useMemo(() => groupCapabilities(capabilities), [capabilities])
  const { form, handleApiSubmit } = useApiForm<GrantCapabilityRequest>({
    defaultValues: {
      capability: '',
    },
    resolver: zodResolver(grantCapabilitySchema),
  })

  useEffect(() => {
    if (open) {
      form.reset({ capability: '' })
    }
  }, [form, open, user?.id])

  const onSubmit = handleApiSubmit(async (values) => {
    if (!user) return

    const capability = values.capability.trim()
    const grantPromise = grantMutation.mutateAsync({
      capability,
      userId: user.id,
    })

    toast.promise(grantPromise, {
      loading: 'Granting capability...',
      success: 'Capability granted.',
      error: getApiErrorMessage,
    })

    await grantPromise
    form.reset({ capability: '' })
  })

  async function revokeSelectedCapability() {
    if (!user || !pendingRevoke) return

    const capability = pendingRevoke
    const revokePromise = revokeMutation.mutateAsync({
      capability,
      userId: user.id,
    })

    toast.promise(revokePromise, {
      loading: 'Revoking capability...',
      success: 'Capability revoked.',
      error: getApiErrorMessage,
    })

    await revokePromise
    setPendingRevoke(null)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-3xl'>
          <DialogHeader>
            <DialogTitle>User capabilities</DialogTitle>
            <DialogDescription>
              {user
                ? `${getAuthUserDisplayName(user)} · ${getAuthUserEmail(user)}`
                : 'Backend capability grants for the selected user.'}
            </DialogDescription>
          </DialogHeader>

          <CapabilityGate requiredCapabilities={CAPABILITY_MANAGE_CAPABILITY}>
            <Form {...form}>
              <form
                id='grant-capability-form'
                onSubmit={onSubmit}
                className='grid gap-3 rounded-md border bg-[var(--sur)] p-3 sm:grid-cols-[1fr_auto] sm:items-end'
              >
                <FormField
                  control={form.control}
                  name='capability'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capability key</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='domain.action'
                          disabled={!user || grantMutation.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type='submit'
                  disabled={!user || grantMutation.isPending}
                >
                  {grantMutation.isPending ? (
                    <Loader2 className='size-4 animate-spin' />
                  ) : (
                    <ShieldPlus className='size-4' />
                  )}
                  Grant
                </Button>
              </form>
            </Form>
          </CapabilityGate>

          <div className='max-h-[55vh] overflow-y-auto pe-1'>
            {capabilitiesQuery.isLoading && (
              <ApiLoading label='Loading capabilities...' />
            )}
            {capabilitiesQuery.isError && (
              <ApiError
                error={capabilitiesQuery.error}
                onRetry={() => {
                  void capabilitiesQuery.refetch()
                }}
              />
            )}
            {!capabilitiesQuery.isLoading &&
              !capabilitiesQuery.isError &&
              groups.length === 0 && (
                <ApiEmpty
                  title='No capabilities granted'
                  description='The backend returned no explicit capability grants for this user.'
                />
              )}
            {!capabilitiesQuery.isLoading &&
              !capabilitiesQuery.isError &&
              groups.length > 0 && (
                <CapabilityGroups
                  groups={groups}
                  isRevoking={revokeMutation.isPending}
                  onRevoke={setPendingRevoke}
                />
              )}
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!pendingRevoke}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setPendingRevoke(null)
        }}
        title='Revoke capability'
        desc={
          pendingRevoke
            ? `Remove ${pendingRevoke} from ${user ? getAuthUserDisplayName(user) : 'this user'}?`
            : 'Remove this capability grant?'
        }
        confirmText='Revoke'
        destructive
        isLoading={revokeMutation.isPending}
        handleConfirm={() => {
          void revokeSelectedCapability()
        }}
      />
    </>
  )
}

function CapabilityGroups({
  groups,
  isRevoking,
  onRevoke,
}: {
  groups: CapabilityGroup[]
  isRevoking: boolean
  onRevoke: (capability: CapabilityKey) => void
}) {
  return (
    <div className='grid gap-3'>
      {groups.map((group) => (
        <Card key={group.name} className='gap-4 py-4'>
          <CardHeader className='px-4'>
            <CardTitle className='text-sm capitalize'>{group.name}</CardTitle>
            <CardDescription>
              {group.capabilities.length}{' '}
              {group.capabilities.length === 1 ? 'capability' : 'capabilities'}
            </CardDescription>
          </CardHeader>
          <CardContent className='flex flex-wrap gap-2 px-4'>
            {group.capabilities.map((capability) => (
              <div
                key={capability}
                className='inline-flex max-w-full items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs font-medium'
              >
                <span className='break-all'>{capability}</span>
                <CapabilityGate
                  requiredCapabilities={CAPABILITY_MANAGE_CAPABILITY}
                >
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='size-6 shrink-0'
                    disabled={isRevoking}
                    onClick={() => onRevoke(capability)}
                    aria-label={`Revoke ${capability}`}
                  >
                    <Trash2 className='size-3.5' />
                  </Button>
                </CapabilityGate>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
