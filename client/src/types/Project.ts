export type Project = {
  id: string
  name: string
  description?: string
  updatedAt: string
  createdAt: string
  tags: {
    technologies: string[]
    topics: string[]
    status: string
    priority: string
  }
  path: string
}
