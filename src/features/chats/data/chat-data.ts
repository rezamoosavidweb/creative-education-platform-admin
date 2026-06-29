export type ChatContact = {
  id: string
  name: string
  color: string
  online: boolean
  time: string
  preview: string
  unread: number
}

export type ChatMessage = {
  id: string
  from: 'me' | 'them'
  text: string
  time: string
}

export const contacts: ChatContact[] = [
  {
    id: 'sarah',
    name: 'Sarah Chen',
    color: '#8b5cf6',
    online: true,
    time: '2m ago',
    preview: "Thanks for the review, I'll pu...",
    unread: 3,
  },
  {
    id: 'mark',
    name: 'Mark Rivera',
    color: '#f59e0b',
    online: true,
    time: '18m ago',
    preview: 'The mockups are ready for y...',
    unread: 1,
  },
  {
    id: 'raj',
    name: 'Raj Kumar',
    color: '#14b8a6',
    online: false,
    time: '1h ago',
    preview: 'Deployment is scheduled for toni...',
    unread: 0,
  },
  {
    id: 'aiko',
    name: 'Aiko Kobayashi',
    color: '#22c55e',
    online: false,
    time: '2h ago',
    preview: 'Can we sync before the standup?',
    unread: 0,
  },
  {
    id: 'lena',
    name: 'Lena Müller',
    color: '#a855f7',
    online: false,
    time: '3h ago',
    preview: "I've attached the Q2 report for rev...",
    unread: 0,
  },
  {
    id: 'theo',
    name: 'Theodore Nakamura',
    color: '#0ea5e9',
    online: false,
    time: '5h ago',
    preview: 'Fixed! Cache issue should be res...',
    unread: 0,
  },
  {
    id: 'amara',
    name: 'Amara Bello',
    color: '#f97316',
    online: false,
    time: '1d ago',
    preview: "Here's the updated onboarding fl...",
    unread: 0,
  },
  {
    id: 'chris',
    name: 'Chris Wang',
    color: '#84cc16',
    online: false,
    time: '1d ago',
    preview: 'PR is up for the auth refactor.',
    unread: 0,
  },
]

export const conversations: Record<string, ChatMessage[]> = {
  sarah: [
    {
      id: 'm1',
      from: 'them',
      text: 'Hey Jordan! Just pushed the auth fix you requested. Can you review when you get a chance?',
      time: '10:24 AM',
    },
    { id: 'm2', from: 'me', text: 'On it! Checking the PR now.', time: '10:26 AM' },
    {
      id: 'm3',
      from: 'them',
      text: 'I also fixed the token expiry regression — it was causing silent logouts after 2 hours.',
      time: '10:27 AM',
    },
    {
      id: 'm4',
      from: 'me',
      text: "Nice catch! That's been bugging us for weeks. I'll test it in staging before approving.",
      time: '10:29 AM',
    },
    {
      id: 'm5',
      from: 'them',
      text: 'Sounds good. Let me know if you need anything else.',
      time: '10:31 AM',
    },
    { id: 'm6', from: 'me', text: 'Will do. Great work today! 👍', time: '10:32 AM' },
  ],
  mark: [
    {
      id: 'k1',
      from: 'them',
      text: 'The mockups are ready for your review whenever you have a moment.',
      time: '9:58 AM',
    },
  ],
  raj: [
    {
      id: 'r1',
      from: 'them',
      text: 'Deployment is scheduled for tonight at 11pm PT.',
      time: '8:40 AM',
    },
  ],
}
