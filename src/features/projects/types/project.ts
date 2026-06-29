export type ProjectStatus = 'Active' | 'Completed' | 'Archived'

export type Project = {
  id: string
  name: string
  description: string
  status: ProjectStatus
  color: string
  progress: number
  tasks: number
  tasksDone: number
  dueDate: string
  team: string[]
}

export type ProjectFilter = 'All' | ProjectStatus
