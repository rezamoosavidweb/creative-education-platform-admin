import { memo } from 'react'
import { Info, Paperclip, Phone, Send, Smile, Video } from 'lucide-react'
import { getInitials } from '@/lib/avatar'
import { cn } from '@/lib/utils'
import { type ChatContact, type ChatMessage } from '../data/chat-data'

type ChatConversationProps = {
  contact: ChatContact
  messages: ChatMessage[]
}

function ActionButton({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type='button'
      aria-label={label}
      className='inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--t2)] transition-colors hover:bg-[var(--sur3)] hover:text-[var(--t1)]'
    >
      {children}
    </button>
  )
}

export const ChatConversation = memo(function ChatConversation({
  contact,
  messages,
}: ChatConversationProps) {
  return (
    <div className='flex flex-1 flex-col bg-[var(--bg)]'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-[var(--bdr)] bg-[var(--sur)] px-5 py-3'>
        <div className='flex items-center gap-3'>
          <div className='relative'>
            <span
              className='flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-semibold text-white'
              style={{ backgroundColor: contact.color }}
            >
              {getInitials(contact.name)}
            </span>
            {contact.online && (
              <span className='absolute -end-0.5 -bottom-0.5 h-[10px] w-[10px] rounded-full border-2 border-[var(--sur)] bg-[var(--ok)]' />
            )}
          </div>
          <div>
            <div className='text-[14px] font-semibold text-[var(--t1)]'>
              {contact.name}
            </div>
            <div className='flex items-center gap-1.5 text-[12px] text-[var(--t2)]'>
              {contact.online && (
                <span className='h-[6px] w-[6px] rounded-full bg-[var(--ok)]' />
              )}
              {contact.online ? 'Active now' : 'Offline'}
            </div>
          </div>
        </div>
        <div className='flex items-center gap-1'>
          <ActionButton label='Call'>
            <Phone className='h-[18px] w-[18px]' />
          </ActionButton>
          <ActionButton label='Video call'>
            <Video className='h-[18px] w-[18px]' />
          </ActionButton>
          <ActionButton label='Conversation info'>
            <Info className='h-[18px] w-[18px]' />
          </ActionButton>
        </div>
      </div>

      {/* Message feed */}
      <div className='flex flex-1 flex-col gap-3 overflow-y-auto p-5'>
        {messages.map((message) => {
          const mine = message.from === 'me'
          return (
            <div
              key={message.id}
              className={cn(
                'flex max-w-[420px] flex-col',
                mine ? 'items-end self-end' : 'items-start self-start'
              )}
            >
              <div
                className={cn(
                  'px-[14px] py-[10px] text-[13.5px] leading-relaxed',
                  mine
                    ? 'rounded-[18px_18px_4px_18px] bg-[var(--pri)] text-white'
                    : 'rounded-[18px_18px_18px_4px] border border-[var(--bdr)] bg-[var(--sur)] text-[var(--t1)]'
                )}
              >
                {message.text}
              </div>
              <span className='mt-1 text-[11px] text-[var(--t3)]'>
                {message.time}
              </span>
            </div>
          )
        })}
      </div>

      {/* Compose */}
      <div className='border-t border-[var(--bdr)] bg-[var(--sur)] p-4'>
        <form
          className='flex items-center gap-2'
          onSubmit={(event) => event.preventDefault()}
        >
          <ActionButton label='Attach file'>
            <Paperclip className='h-[18px] w-[18px]' />
          </ActionButton>
          <input
            type='text'
            placeholder='Type a message...'
            className='h-10 flex-1 rounded-full border-[1.5px] border-[var(--bdr2)] bg-[var(--sur2)] px-4 text-[13.5px] text-[var(--t1)] outline-none placeholder:text-[var(--t3)] focus:border-[var(--pri)]'
          />
          <ActionButton label='Emoji'>
            <Smile className='h-[18px] w-[18px]' />
          </ActionButton>
          <button
            type='submit'
            aria-label='Send message'
            className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--pri)] text-white transition-colors hover:bg-[var(--prih)]'
          >
            <Send className='h-[18px] w-[18px]' />
          </button>
        </form>
      </div>
    </div>
  )
})
ChatConversation.displayName = 'ChatConversation'
