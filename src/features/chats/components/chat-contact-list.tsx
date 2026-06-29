import { memo } from 'react'
import { SearchIcon } from 'lucide-react'
import { getInitials } from '@/lib/avatar'
import { cn } from '@/lib/utils'
import { type ChatContact } from '../data/chat-data'

type ChatContactListProps = {
  contacts: ChatContact[]
  activeId: string
  onSelect: (id: string) => void
}

export const ChatContactList = memo(function ChatContactList({
  contacts,
  activeId,
  onSelect,
}: ChatContactListProps) {
  return (
    <div className='flex w-full flex-col border-e border-[var(--bdr)] bg-[var(--sur)] sm:w-[300px]'>
      <div className='border-b border-[var(--bdr)] p-4'>
        <h2 className='mb-3 text-lg font-bold text-[var(--t1)]'>
          Direct Messages
        </h2>
        <label className='flex h-9 items-center gap-2 rounded-md border border-[var(--bdr2)] bg-[var(--sur)] px-2.5'>
          <SearchIcon className='h-4 w-4 text-[var(--t3)]' />
          <span className='sr-only'>Search conversations</span>
          <input
            type='text'
            placeholder='Search conversations...'
            className='w-full bg-transparent text-[13px] text-[var(--t1)] outline-none placeholder:text-[var(--t3)]'
          />
        </label>
      </div>

      <div className='flex-1 overflow-y-auto'>
        {contacts.map((contact) => {
          const active = contact.id === activeId
          return (
            <button
              key={contact.id}
              type='button'
              onClick={() => onSelect(contact.id)}
              className={cn(
                'flex w-full items-center gap-3 border-s-[3px] px-4 py-3 text-start transition-colors',
                active
                  ? 'border-[var(--pri)] bg-[var(--pris)]'
                  : 'border-transparent hover:bg-[var(--sur2)]'
              )}
            >
              <div className='relative shrink-0'>
                <span
                  className='flex h-10 w-10 items-center justify-center rounded-full text-[12px] font-semibold text-white'
                  style={{ backgroundColor: contact.color }}
                >
                  {getInitials(contact.name)}
                </span>
                {contact.online && (
                  <span className='absolute -end-0.5 -bottom-0.5 h-[11px] w-[11px] rounded-full border-2 border-[var(--sur)] bg-[var(--ok)]' />
                )}
              </div>
              <div className='min-w-0 flex-1'>
                <div className='flex items-center justify-between gap-2'>
                  <span className='truncate text-[13.5px] font-medium text-[var(--t1)]'>
                    {contact.name}
                  </span>
                  <span className='shrink-0 text-[11px] text-[var(--t3)]'>
                    {contact.time}
                  </span>
                </div>
                <div className='flex items-center justify-between gap-2'>
                  <span className='truncate text-[12.5px] text-[var(--t2)]'>
                    {contact.preview}
                  </span>
                  {contact.unread > 0 && (
                    <span className='flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full bg-[var(--err)] px-1 text-[10px] font-bold text-white'>
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
})
ChatContactList.displayName = 'ChatContactList'
