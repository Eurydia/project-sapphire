export type Project = {
  id: string
  name: string
  tags: {
    technologies: Array<string>
    topics: Array<string>
  }
}
