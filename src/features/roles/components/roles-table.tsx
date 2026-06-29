import { memo } from 'react'
import { Copy, Pencil, Trash2 } from 'lucide-react'
import { type Role } from '../types/role'

type RolesTableProps = {
  roles: Role[]
}

function IconButton({
  label,
  onClick,
  danger,
  children,
}: {
  label: string
  onClick?: () => void
  danger?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type='button'
      aria-label={label}
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--t2)] transition-colors hover:bg-[var(--sur3)] ${
        danger ? 'hover:text-[var(--err)]' : 'hover:text-[var(--t1)]'
      }`}
    >
      {children}
    </button>
  )
}

export const RolesTable = memo(function RolesTable({ roles }: RolesTableProps) {
  return (
    <div className='overflow-x-auto rounded-[10px] border border-[var(--bdr)] bg-[var(--sur)]'>
      <table className='w-full border-collapse text-[13.5px]'>
        <thead>
          <tr className='border-b border-[var(--bdr)] bg-[var(--sur2)]'>
            <th className='px-[14px] py-[10px] text-left text-[11px] font-semibold tracking-[0.07em] text-[var(--t3)] uppercase'>
              Role
            </th>
            <th className='px-[14px] py-[10px] text-left text-[11px] font-semibold tracking-[0.07em] text-[var(--t3)] uppercase'>
              Description
            </th>
            <th className='px-[14px] py-[10px] text-left text-[11px] font-semibold tracking-[0.07em] text-[var(--t3)] uppercase'>
              Members
            </th>
            <th className='px-[14px] py-[10px] text-left text-[11px] font-semibold tracking-[0.07em] text-[var(--t3)] uppercase'>
              Permissions
            </th>
            <th className='px-[14px] py-[10px] text-left text-[11px] font-semibold tracking-[0.07em] text-[var(--t3)] uppercase'>
              Created
            </th>
            <th className='px-[14px] py-[10px]' />
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr
              key={role.id}
              className='border-b border-[var(--bdr)] transition-colors last:border-b-0 hover:bg-[var(--sur2)]'
            >
              <td className='px-[14px] py-[13px]'>
                <div className='flex items-center gap-2.5'>
                  <span
                    className='h-2.5 w-2.5 shrink-0 rounded-full'
                    style={{ backgroundColor: role.color }}
                  />
                  <span className='font-semibold text-[var(--t1)]'>
                    {role.name}
                  </span>
                </div>
              </td>
              <td className='px-[14px] py-[13px] text-[var(--t2)]'>
                {role.description}
              </td>
              <td className='px-[14px] py-[13px]'>
                <span className='inline-flex items-center rounded-full bg-[var(--sur3)] px-2 py-0.5 text-[12px] text-[var(--t2)]'>
                  <span className='font-semibold text-[var(--t1)]'>
                    {role.members}
                  </span>
                  &nbsp;members
                </span>
              </td>
              <td className='px-[14px] py-[13px]'>
                <span className='inline-flex items-center rounded-full bg-[var(--pris)] px-2 py-0.5 text-[12px] text-[var(--pri)]'>
                  <span className='font-semibold'>{role.permissions}</span>
                  &nbsp;permissions
                </span>
              </td>
              <td className='px-[14px] py-[13px] text-[var(--t2)]'>
                {role.created}
              </td>
              <td className='px-[14px] py-[13px]'>
                <div className='flex items-center justify-end gap-1'>
                  <IconButton label={`Edit ${role.name}`}>
                    <Pencil className='h-4 w-4' />
                  </IconButton>
                  <IconButton label={`Duplicate ${role.name}`}>
                    <Copy className='h-4 w-4' />
                  </IconButton>
                  <IconButton label={`Delete ${role.name}`} danger>
                    <Trash2 className='h-4 w-4' />
                  </IconButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})
RolesTable.displayName = 'RolesTable'
