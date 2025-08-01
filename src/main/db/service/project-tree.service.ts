import { existsSync, PathLike, readdirSync, statSync } from "fs"
import { normalize } from "path"
import { z } from "zod/v4"
import { AppDataSource } from "../data-source"
import { ProjectTreeEntity } from "../entity/project-tree/project-tree.entity"
import { ProjectEntity } from "../entity/project.entity"

const readDirectoryEntires = (path: PathLike) => {
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

const getProjectRootMetadata = async (root: string) => {
  return statDir(root).then((result) => {
    if (isLeft(result)) {
      return null
    }
    const { atimeMs, birthtimeMs, mtimeMs } = result.right
    return {
      ctime: {
        fromNow: moment(birthtimeMs).fromNow(),
        exact: moment(birthtimeMs).toLocaleString(),
      },
      mtime: {
        fromNow: moment(mtimeMs).fromNow(),
        exact: moment(mtimeMs).toLocaleString(),
      },
      atime: {
        fromNow: moment(atimeMs).fromNow(),
        exact: moment(atimeMs).toLocaleString(),
      },
    }
  })
}

const getRoot = async (arg: unknown) => {
  const uuid = z.uuidv4().parse(arg)
  return AppDataSource.transaction(async (mgr) => {
    const project = await mgr.findOne(ProjectEntity, {
      where: { uuid },
    })
    if (project === null) {
      return null
    }

    const path = normalize(project.root).trim()
    if (!existsSync(path)) {
      return null
    }

    const pathStat = statSync(path)
    if (!pathStat.isDirectory()) {
      return null
    }

    const pathConfig = await mgr.findOne(ProjectTreeEntity, {
      where: { project, path: "" },
    })

    const { dirs, files } = readDirectoryEntires(path)

    return {
      parentPath: path,
      path: null,
      files,
      dirs,
    }
  })
}
