import { ProjectTree } from "#/models/project-tree/project-tree"
import {
  existsSync,
  PathLike,
  readdirSync,
  readFileSync,
  statSync,
} from "fs"
import { join } from "path"
import { ProjectTreeEntity } from "../entity/project-tree.entity"

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
  const path = join(tree.project.root, tree.path, tree.readme)
  if (!existsSync(path)) {
    return {
      name: tree.readme,
      content: null,
    } satisfies ProjectTree["readme"]
  }

  const pathStat = statSync(path)
  if (!pathStat.isFile()) {
    return {
      name: tree.readme,
      content: null,
    } satisfies ProjectTree["readme"]
  }

  const fileContent = readFileSync(path)

  return {
    name: tree.readme,
    content: String(fileContent),
  } satisfies ProjectTree["readme"]
}
