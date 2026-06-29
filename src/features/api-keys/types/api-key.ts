export type ApiKeyStatus = 'Active' | 'Expiring' | 'Expired'

export type ApiKey = {
  id: string
  name: string
  key: string
  scopes: string[]
  created: string
  expires: string
  status: ApiKeyStatus
}
