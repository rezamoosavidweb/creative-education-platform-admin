export type LoginEvent = {
  id: string
  ip: string
  device: string
  location: string
  time: string
  status: 'Success' | 'Failed'
}

export const loginHistory: LoginEvent[] = [
  {
    id: 'l1',
    ip: '12.34.56.78',
    device: 'Chrome · macOS',
    location: 'San Francisco, US',
    time: '2 min ago',
    status: 'Success',
  },
  {
    id: 'l2',
    ip: '12.34.56.78',
    device: 'Chrome · macOS',
    location: 'San Francisco, US',
    time: '1 day ago',
    status: 'Success',
  },
  {
    id: 'l3',
    ip: '98.76.54.32',
    device: 'Firefox · Windows',
    location: 'New York, US',
    time: '2 days ago',
    status: 'Success',
  },
  {
    id: 'l4',
    ip: '192.168.2.44',
    device: 'Unknown',
    location: 'Unknown',
    time: '2 days ago',
    status: 'Failed',
  },
  {
    id: 'l5',
    ip: '192.168.2.44',
    device: 'Unknown',
    location: 'Unknown',
    time: '2 days ago',
    status: 'Failed',
  },
]
