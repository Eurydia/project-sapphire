import { createProjectDtoSchema } from "#/models/project/dto/create-project.dto"
import { projectQuerySchema } from "#/models/project/dto/query-project.dto"
import { upsertProjectDtoSchema } from "#/models/project/dto/upsert-project.dto"
import { Project } from "#/models/project/project"
import { registerIpcMainServices } from "@/services/core"
import { normalize } from "path"
import { In } from "typeorm"
import z4 from "zod/v4"
import { AppDataSource } from "../data-source"
import { ProjectEntity } from "../entity/project.entity"
import { InOrUndefined } from "./helper"
import {
  _fillTags,
  _fromTableEntity,
} from "./project.service.helper"

const repo = AppDataSource.getRepository(ProjectEntity)

const list = (arg: unknown) => {
  const query = projectQuerySchema.parse(arg)

  return AppDataSource.transaction(async (mgr) => {
    const entities = await mgr.find(ProjectEntity, {
      where: {
        name: InOrUndefined(query.names),
        tags: { name: InOrUndefined(query.tags) },
      },
      order: {
        pinned: "DESC",
        name: "ASC",
      },
      relations: {
        tags: true,
      },
    })
    const items: Project[] = []
    for (const entity of entities) {
      items.push(await _fromTableEntity(entity))
    }
    return items
  })
}

const listNames = async () => {
  const results = await repo.find({
    order: { name: "asc" },
    select: { name: true },
  })
  return results.map(({ name }) => name)
}

const listByUuids = async (arg: unknown) => {
  const uuids = z4.uuidv4().array().parse(arg)
  return AppDataSource.transaction(async (mgr) => {
    const entities = await mgr.find(ProjectEntity, {
      where: { uuid: In(uuids) },
      order: {
        pinned: "DESC",
        name: "ASC",
      },
      relations: { tags: true },
    })
    const items: Project[] = []
    for (const entity of entities) {
      items.push(await _fromTableEntity(entity))
    }
    return items
  })
}
const listByNames = async (arg: unknown) => {
  const names = z4
    .string()
    .trim()
    .nonempty()
    .normalize()
    .array()
    .parse(arg)
  return AppDataSource.transaction(async (mgr) => {
    const entities = await mgr.find(ProjectEntity, {
      where: { name: In(names) },
      order: {
        pinned: "DESC",
        name: "ASC",
      },
      relations: { tags: true },
    })
    const items: Project[] = []
    for (const entity of entities) {
      items.push(await _fromTableEntity(entity))
    }
    return items
  })
}

const findByUuid = async (arg: unknown) => {
  const uuid = z4.uuidv4().parse(arg)
  return AppDataSource.transaction(async (mgr) => {
    const entity = await mgr.findOne(ProjectEntity, {
      where: { uuid },
      relations: { tags: true },
    })
    if (entity === null) {
      return null
    }
    const item = await _fromTableEntity(entity)
    return item satisfies Project
  })
}

const pin = async (arg: unknown) => {
  const uuid = z4.uuidv4().parse(arg)
  return AppDataSource.manager.transaction(async (mgn) => {
    const item = await mgn.findOne(ProjectEntity, {
      where: { uuid },
    })
    if (item === null) {
      return null
    }
    item.pinned = true
    return repo.save(item)
  })
}

const unpin = async (arg: unknown) => {
  const uuid = z4.uuidv4().parse(arg)
  return AppDataSource.manager.transaction(async (mgn) => {
    const item = await mgn.findOne(ProjectEntity, {
      where: { uuid },
    })
    if (item === null) {
      return null
    }
    item.pinned = false
    return repo.save(item)
  })
}

const createProject = async (arg: unknown) => {
  const dto = createProjectDtoSchema.parse(arg)
  return AppDataSource.transaction(async (mgr) => {
    const tags = await _fillTags(mgr, dto)
    const project = mgr.create(ProjectEntity, {
      name: dto.name,
      root: normalize(dto.root).trim(),
      pinned: false,
      description: dto.description,
      tags,
    })
    return mgr.save(ProjectEntity, project)
  })
}

const upsertProject = async (arg: unknown) => {
  const dto = upsertProjectDtoSchema.parse(arg)
  return AppDataSource.transaction(async (mgr) => {
    const tags = await _fillTags(mgr, dto)
    const project = await mgr.preload(ProjectEntity, {
      uuid: dto.uuid,
      root: dto.root,
      name: dto.name,
      description: dto.description,
      tags,
    })
    return mgr.save(project)
  })
}

registerIpcMainServices("db$project", {
  list,
  listNames,
  listByUuids,
  listByNames,
  unpin,
  pin,
  findByUuid,
  createProject,
  upsertProject,
})
