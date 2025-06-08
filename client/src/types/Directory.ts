export type ProjectDirectory = {
  path: string
  files: string[]
  subdirectories: string[]
  lastModified: string
  lastSynchronized: string
  indexFile?: {
    content: string
    path: string
    name: string
  }
}
