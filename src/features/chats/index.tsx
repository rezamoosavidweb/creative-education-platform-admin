import { useMemo, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ChatContactList } from './components/chat-contact-list'
import { ChatConversation } from './components/chat-conversation'
import { contacts, conversations } from './data/chat-data'

export function Chats() {
  const [activeId, setActiveId] = useState(contacts[0].id)

  const activeContact = useMemo(
    () => contacts.find((c) => c.id === activeId) ?? contacts[0],
    [activeId]
  )
  const messages = conversations[activeId] ?? []

  return (
    <>
      <Header fixed />

      <Main fixed className='p-0'>
        <section className='flex h-full'>
          <ChatContactList
            contacts={contacts}
            activeId={activeId}
            onSelect={setActiveId}
          />
          <ChatConversation contact={activeContact} messages={messages} />
        </section>
      </Main>
    </>
  )
}
