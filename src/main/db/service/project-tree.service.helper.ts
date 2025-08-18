import { ProjectTree } from "#/models/project-tree/project-tree"
import { PathLike, readdirSync } from "fs"
import { ProjectTreeEntity } from "../entities/project-tree.entity"

export const readDirectoryEntires = (path: PathLike) => {
  const files: string[] = []
  const dirs: string[] = []
  const entries = readdirSync(path, {
    withFileTypes: true,
    recursive: false,
  })
  for (const entry of entries) {
    if (entry.isFile()) {
      files.push(entry.name)
    } else if (entry.isDirectory()) {
      dirs.push(entry.name)
    }
  }
  return { files, dirs }
}

export const getTreeReadme = (
  tree: ProjectTreeEntity | null,
) => {
  if (tree === null || tree.readme === undefined) {
    return null
  }

  return {
    name: tree.readme,
    content: "",
  } satisfies ProjectTree["readme"]
}
