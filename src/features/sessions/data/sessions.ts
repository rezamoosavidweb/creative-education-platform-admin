export type SessionDevice = 'monitor' | 'smartphone'

export type Session = {
  id: string
  device: string
  icon: SessionDevice
  location: string
  ip: string
  lastActive: string
  current: boolean
}

export const sessions: Session[] = [
  {
    id: 's1',
    device: 'Chrome · macOS 14',
    icon: 'monitor',
    location: 'San Francisco, CA',
    ip: '12.34.56.78',
    lastActive: 'Active now',
    current: true,
  },
  {
    id: 's2',
    device: 'Safari · iPhone 16',
    icon: 'smartphone',
    location: 'San Francisco, CA',
    ip: '12.34.56.79',
    lastActive: '3h ago',
    current: false,
  },
  {
    id: 's3',
    device: 'Chrome · Windows 11',
    icon: 'monitor',
    location: 'New York, NY',
    ip: '98.76.54.32',
    lastActive: '2 days ago',
    current: false,
  },
  {
    id: 's4',
    device: 'Firefox · Ubuntu 24',
    icon: 'monitor',
    location: 'Remote — VPN',
    ip: '10.0.0.5',
    lastActive: '5 days ago',
    current: false,
  },
]
