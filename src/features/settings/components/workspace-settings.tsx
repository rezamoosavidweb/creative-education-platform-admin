import { Plus, Trash2 } from 'lucide-react'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

function SectionTitle({
  children,
  danger,
}: {
  children: React.ReactNode
  danger?: boolean
}) {
  return (
    <div
      className={`mb-5 border-b border-[var(--bdr)] pb-3 text-[15px] font-semibold ${
        danger ? 'text-[var(--err)]' : 'text-[var(--t1)]'
      }`}
    >
      {children}
    </div>
  )
}

function Field({
  label,
  htmlFor,
  className,
  children,
}: {
  label: string
  htmlFor: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor} className='mb-1.5 block text-[12.5px] text-[var(--t2)]'>
        {label}
      </Label>
      {children}
    </div>
  )
}

const selectClass =
  'h-9 w-full cursor-pointer rounded-md border-[1.5px] border-[var(--bdr2)] bg-[var(--sur)] px-3 text-[13.5px] text-[var(--t1)] outline-none focus:border-[var(--pri)]'

export function WorkspaceSettings() {
  return (
    <div className='mx-auto flex w-full max-w-[880px] flex-col gap-4'>
      {/* Workspace Identity */}
      <Card className='gap-0 border border-[var(--bdr)] bg-[var(--sur)] p-6'>
        <SectionTitle>Workspace Identity</SectionTitle>
        <div className='grid gap-4 sm:grid-cols-2'>
          <Field label='Workspace name' htmlFor='ws-name'>
            <Input id='ws-name' defaultValue='Acme Corp' />
          </Field>
          <Field label='URL slug' htmlFor='ws-slug'>
            <Input id='ws-slug' defaultValue='acme-corp' />
          </Field>
          <Field label='Website' htmlFor='ws-site'>
            <Input id='ws-site' type='url' defaultValue='https://acme.com' />
          </Field>
          <Field label='Timezone' htmlFor='ws-tz'>
            <select id='ws-tz' className={selectClass} defaultValue='la'>
              <option value='la'>America/Los_Angeles (UTC−7)</option>
              <option value='ny'>America/New_York (UTC−4)</option>
              <option value='ldn'>Europe/London (UTC+1)</option>
              <option value='tky'>Asia/Tokyo (UTC+9)</option>
            </select>
          </Field>
          <Field label='Description' htmlFor='ws-desc' className='sm:col-span-2'>
            <Textarea
              id='ws-desc'
              className='h-[72px] resize-y leading-relaxed'
              defaultValue='Enterprise SaaS platform trusted by 2,000+ companies worldwide.'
            />
          </Field>
        </div>
        <div className='mt-5 flex gap-2'>
          <Button onClick={() => showSubmittedData({ section: 'workspace-identity' })}>
            Save Changes
          </Button>
          <Button variant='outline'>Cancel</Button>
        </div>
      </Card>

      {/* Team & Access */}
      <Card className='gap-0 border border-[var(--bdr)] bg-[var(--sur)] p-6'>
        <SectionTitle>Team &amp; Access</SectionTitle>
        <div className='grid gap-4 sm:grid-cols-2'>
          <Field label='Default role for new members' htmlFor='ta-role'>
            <select id='ta-role' className={selectClass} defaultValue='viewer'>
              <option value='viewer'>Viewer</option>
              <option value='developer'>Developer</option>
              <option value='analyst'>Analyst</option>
            </select>
          </Field>
          <Field label='Allow public sign-ups' htmlFor='ta-signup'>
            <select id='ta-signup' className={selectClass} defaultValue='off'>
              <option value='off'>Disabled — invite only</option>
              <option value='on'>Enabled — anyone can join</option>
            </select>
          </Field>
        </div>
        <div className='mt-5 flex gap-2'>
          <Button onClick={() => showSubmittedData({ section: 'team-access' })}>
            Save Changes
          </Button>
        </div>
      </Card>

      {/* Security Policies */}
      <Card className='gap-0 border border-[var(--bdr)] bg-[var(--sur)] p-6'>
        <SectionTitle>Security Policies</SectionTitle>
        <div className='flex items-center justify-between gap-4 border-b border-[var(--bdr)] py-4'>
          <div>
            <div className='text-[13.5px] font-medium text-[var(--t1)]'>
              Require Two-Factor Authentication
            </div>
            <div className='text-[12.5px] text-[var(--t3)]'>
              All members must enable 2FA to access the workspace
            </div>
          </div>
          <Switch defaultChecked aria-label='Require two-factor authentication' />
        </div>
        <div className='flex items-center justify-between gap-4 border-b border-[var(--bdr)] py-4'>
          <div>
            <div className='text-[13.5px] font-medium text-[var(--t1)]'>
              Session Timeout
            </div>
            <div className='text-[12.5px] text-[var(--t3)]'>
              Automatically sign out inactive sessions
            </div>
          </div>
          <select
            aria-label='Session timeout'
            className={`${selectClass} w-40`}
            defaultValue='8h'
          >
            <option value='8h'>After 8 hours</option>
            <option value='24h'>After 24 hours</option>
            <option value='7d'>After 7 days</option>
            <option value='never'>Never</option>
          </select>
        </div>
        <div className='flex items-center justify-between gap-4 py-4'>
          <div>
            <div className='text-[13.5px] font-medium text-[var(--t1)]'>
              IP Allowlist
            </div>
            <div className='text-[12.5px] text-[var(--t3)]'>
              Restrict access to specific IP addresses or CIDR ranges
            </div>
          </div>
          <Button variant='outline' size='sm'>
            <Plus className='h-4 w-4' />
            Add IP Range
          </Button>
        </div>
        <div className='mt-1 flex gap-2'>
          <Button onClick={() => showSubmittedData({ section: 'security-policies' })}>
            Save Policies
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className='gap-0 border border-[var(--err)]/30 bg-[var(--sur)] p-6'>
        <SectionTitle danger>Danger Zone</SectionTitle>
        <div className='flex items-center justify-between gap-4 border-b border-[var(--bdr)] py-3'>
          <div>
            <div className='text-[13.5px] font-medium text-[var(--t1)]'>
              Export workspace data
            </div>
            <div className='text-[12.5px] text-[var(--t3)]'>
              Download all workspace data as a ZIP archive
            </div>
          </div>
          <Button variant='outline' size='sm'>
            Export Data
          </Button>
        </div>
        <div className='flex items-center justify-between gap-4 py-3'>
          <div>
            <div className='text-[13.5px] font-medium text-[var(--err)]'>
              Delete workspace
            </div>
            <div className='text-[12.5px] text-[var(--t3)]'>
              Permanently delete this workspace. This cannot be undone.
            </div>
          </div>
          <Button
            size='sm'
            className='border border-[var(--err)]/40 bg-transparent text-[var(--err)] hover:bg-[var(--errs)]'
          >
            <Trash2 className='h-4 w-4' />
            Delete Workspace
          </Button>
        </div>
      </Card>
    </div>
  )
}
