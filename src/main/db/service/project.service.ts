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
import {
  _fillTags,
  _fromTableEntity,
} from "./project.service.helper"

const repo = AppDataSource.getRepository(ProjectEntity)

const list = (arg: unknown) => {
  console.debug(arg)
  const query = projectQuerySchema.parse(arg)

  return AppDataSource.transaction(async (mgr) => {
    const entities = await mgr.find(ProjectEntity, {
      where: {
        name: In(query.names),
        topics: { name: In(query.topics) },
        techs: { name: In(query.techs) },
        groups: { name: In(query.groups) },
      },
    })
    const items = await Promise.all(
      entities.map((ent) => _fromTableEntity(ent)),
    )
    return items satisfies Project[]
  })
}
const listByUuids = async (arg: unknown) => {
  const uuids = z4.uuidv4().array().parse(arg)
  return AppDataSource.transaction(async (mgr) => {
    const entities = await mgr.find(ProjectEntity, {
      where: { uuid: In(uuids) },
    })
    const items = await Promise.all(
      entities.map((ent) => _fromTableEntity(ent)),
    )
    return items satisfies Project[]
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
    })
    const items = await Promise.all(
      entities.map((ent) => _fromTableEntity(ent)),
    )
    return items satisfies Project[]
  })
}

const findByUuid = async (arg: unknown) => {
  const uuid = z4.uuidv4().parse(arg)
  return AppDataSource.transaction(async (mgr) => {
    const entity = await mgr.findOne(ProjectEntity, {
      where: { uuid },
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
    const { groups, techs, topics } = await _fillTags(mgr, dto)
    const project = mgr.create(ProjectEntity, {
      name: dto.name,
      root: normalize(dto.root).trim(),
      pinned: false,
      description: dto.description ?? null,
      groups,
      techs,
      topics,
    })
    return mgr.save(ProjectEntity, project)
  })
}

const upsertProject = async (arg: unknown) => {
  const dto = upsertProjectDtoSchema.parse(arg)
  return AppDataSource.transaction(async (mgr) => {
    const { groups, techs, topics } = await _fillTags(mgr, dto)
    const project = mgr.create(ProjectEntity, {
      uuid: dto.uuid,
      name: dto.name,
      pinned: dto.pinned,
      root: normalize(dto.root).trim(),
      description: dto.description ?? null,
      groups,
      techs,
      topics,
    })
    return mgr.save(ProjectEntity, project)
  })
}

registerIpcMainServices("db$project", {
  list,
  listByUuids,
  listByNames,
  unpin,
  pin,
  findByUuid,
  createProject,
  upsertProject,
})
