export type OrgPlan = 'Enterprise' | 'Professional' | 'Standard'
export type OrgStatus = 'Active' | 'Suspended'

export type Organization = {
  id: string
  name: string
  slug: string
  plan: OrgPlan
  members: number
  status: OrgStatus
  admin: string
  created: string
  logoColor: string
}
