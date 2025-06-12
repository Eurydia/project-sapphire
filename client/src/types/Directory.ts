export type ProjectFile = unknown
export type ProjectSubdirectory = unknown

export type ProjectDirectory = {
  fullPath: string
  name: string
  files: ProjectFile[]
  subdirectories: ProjectSubdirectory[]
  readme?: ProjectFile
}
