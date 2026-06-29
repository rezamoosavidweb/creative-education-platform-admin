export type PermissionRole = {
  id: string
  name: string
  color: string
}

export type Permission = {
  id: string
  name: string
  description: string
  // Boolean flags aligned by index to the roles array.
  allowed: boolean[]
}
