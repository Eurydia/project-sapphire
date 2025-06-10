export type ProjectDirectory = {
  path: string
  files: { name: string; path: string; createdAt: string; updatedAt: string }[]
  excludedFiles: string[]
  subdirectories: {
    name: string
    path: string
    createdAt: string
    updatedAt: string
  }[]
  excludedSubdirectories: string[]
  lastUpdated: string
  lastSynchronized: string
  readme?: {
    content: string
    path: string
    name: string
  }
}
