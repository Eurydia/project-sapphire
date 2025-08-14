import { ProjectTree } from "#/models/project-tree/project-tree"
import { registerIpcMainServices } from "@/services/core"
import { existsSync, statSync } from "fs"
import { join, normalize } from "path"
import { z } from "zod/v4"
import { AppDataSource } from "../data-source"
import { ProjectTreeEntity } from "../entity/project-tree.entity"
import { ProjectEntity } from "../entity/project.entity"
import {
  getTreeReadme,
  readDirectoryEntires,
} from "./project-tree.service.helper"

const getRootTree = async (arg: unknown) => {
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

    const tree = await mgr.findOne(ProjectTreeEntity, {
      where: { project, path: "" },
    })

    const { dirs, files } = readDirectoryEntires(path)
    const readme = getTreeReadme(tree)

    return {
      parentPath: path,
      path: null,
      files,
      dirs,
      projectUuid: uuid,
      readme,
    } satisfies ProjectTree
  })
}

const getTree = async (arg: unknown) => {
  const { uuid, segments } = z
    .object({
      uuid: z.uuidv4(),
      segments: z.string().trim().normalize(),
    })
    .parse(arg)

  return AppDataSource.transaction(async (mgr) => {
    const project = await mgr.findOne(ProjectEntity, {
      where: { uuid },
    })
    if (project === null) {
      return null
    }

    const path = normalize(join(project.root, segments))
    if (!existsSync(path)) {
      return null
    }

    const pathStat = statSync(path)
    if (!pathStat.isDirectory()) {
      return null
    }

    const tree = await mgr.findOne(ProjectTreeEntity, {
      where: { project, path },
    })

    const { dirs, files } = readDirectoryEntires(path)
    const readme = getTreeReadme(tree)

    return {
      parentPath: path,
      path,
      files,
      dirs,
      projectUuid: uuid,
      readme,
    } satisfies ProjectTree
  })
}

registerIpcMainServices("db$project-tree", {
  getRootTree,
  getTree,
})
