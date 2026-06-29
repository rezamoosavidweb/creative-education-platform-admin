import { memo } from 'react'
import { cn } from '@/lib/utils'
import { type Permission, type PermissionRole } from '../types/permission'

type PermissionMatrixProps = {
  roles: PermissionRole[]
  permissions: Permission[]
}

function PermissionDot({ allowed }: { allowed: boolean }) {
  return (
    <span
      className={cn(
        'inline-block h-2 w-2 rounded-full',
        allowed ? 'bg-[var(--ok)]' : 'bg-[var(--bdr2)]'
      )}
      aria-label={allowed ? 'Allowed' : 'Denied'}
    />
  )
}

export const PermissionMatrix = memo(function PermissionMatrix({
  roles,
  permissions,
}: PermissionMatrixProps) {
  return (
    <div className='overflow-x-auto rounded-[10px] border border-[var(--bdr)] bg-[var(--sur)]'>
      <table className='w-full border-collapse text-[13.5px]'>
        <thead>
          <tr className='border-b border-[var(--bdr)] bg-[var(--sur2)]'>
            <th className='px-[14px] py-[10px] text-left text-[11px] font-semibold tracking-[0.07em] text-[var(--t3)] uppercase'>
              Permission
            </th>
            {roles.map((role) => (
              <th
                key={role.id}
                className='px-[14px] py-[10px] text-center text-[11px] font-semibold tracking-[0.07em] uppercase whitespace-nowrap'
                style={{ color: role.color }}
              >
                {role.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {permissions.map((permission) => (
            <tr
              key={permission.id}
              className='border-b border-[var(--bdr)] transition-colors last:border-b-0 hover:bg-[var(--sur2)]'
            >
              <td className='px-[14px] py-[11px]'>
                <div className='font-medium text-[var(--t1)]'>
                  {permission.name}
                </div>
                <div className='text-[12px] text-[var(--t3)]'>
                  {permission.description}
                </div>
              </td>
              {permission.allowed.map((allowed, index) => (
                <td
                  key={roles[index]?.id ?? index}
                  className='px-[14px] py-[11px] text-center'
                >
                  <PermissionDot allowed={allowed} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})
PermissionMatrix.displayName = 'PermissionMatrix'
