import { memo } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { type NotificationGroup } from '../data/notifications'

type NotificationPreferencesProps = {
  groups: NotificationGroup[]
}

export const NotificationPreferences = memo(function NotificationPreferences({
  groups,
}: NotificationPreferencesProps) {
  return (
    <div className='flex flex-col gap-4 sm:gap-6'>
      {groups.map((group) => (
        <Card key={group.id} className='border border-[var(--bdr)] bg-[var(--sur)]'>
          <CardHeader>
            <CardTitle className='text-[var(--t1)]'>{group.title}</CardTitle>
          </CardHeader>
          <CardContent className='divide-y divide-[var(--bdr)] p-0'>
            {group.preferences.map((preference) => (
              <div
                key={preference.id}
                className='flex items-center justify-between gap-4 px-5 py-3.5'
              >
                <div>
                  <Label
                    htmlFor={preference.id}
                    className='text-[13.5px] font-medium text-[var(--t1)]'
                  >
                    {preference.label}
                  </Label>
                  <p className='text-[12.5px] text-[var(--t2)]'>
                    {preference.description}
                  </p>
                </div>
                <Switch id={preference.id} defaultChecked={preference.defaultOn} />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
})
NotificationPreferences.displayName = 'NotificationPreferences'
