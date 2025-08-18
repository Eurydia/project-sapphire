import { createProjectDtoSchema } from "#/models/project/dto/create-project.dto"
import {
  projectPaginationQuerySchema,
  ProjectPaginationResult,
} from "#/models/project/dto/pagination-project.dto"
import { upsertProjectDtoSchema } from "#/models/project/dto/upsert-project.dto"
import { Project } from "#/models/project/project"
import { registerIpcMainServices } from "@/services/core"
import { EntityNotFoundError, In } from "typeorm"
import z4 from "zod/v4"
import { AppDataSource } from "../data-source"
import { ProjectEntity } from "../entities/project.entity"
import { InOrUndefined } from "./helper"
import {
  _fillTags,
  _fromTableEntity,
  extractProjectQuery,
} from "./project.service.helper"

const repo = AppDataSource.getRepository(ProjectEntity)

const list = async (arg: unknown) => {
  const { pageIndex, query, resultsPerPage, orderBy } =
    projectPaginationQuerySchema.parse(arg)

  const { entities, totalCount } =
    await AppDataSource.transaction(async (mgr) => {
      const { names, tagNames } = extractProjectQuery(query)
      const repo = mgr.getRepository(ProjectEntity)
      const entities = await repo.find({
        skip: resultsPerPage * pageIndex,
        take: resultsPerPage,
        where: {
          name: InOrUndefined(names),
          tags: { name: InOrUndefined(tagNames) },
        },
        order: {
          pinned: "DESC",
          lastVisited:
            orderBy === "lastVisited" ? "DESC" : undefined,
          name: orderBy === "name" ? "ASC" : undefined,
        },
        relations: {
          tags: true,
        },
        relationLoadStrategy: "query",
      })
      const totalCount = await repo.count({
        where: {
          name: InOrUndefined(names),
          tags: { name: InOrUndefined(tagNames) },
        },
      })
      return { entities, totalCount }
    })
  const items = <Project[]>[]
  for (const entity of entities) {
    items.push(await _fromTableEntity(entity))
  }
  return {
    items,
    pageIndex,
    resultsPerPage: resultsPerPage,
    totalCount,
    pageCount: Math.ceil(totalCount / resultsPerPage),
  } satisfies ProjectPaginationResult
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
    const repo = mgr.getRepository(ProjectEntity)
    const hasProject = await repo.exists({
      where: { uuid },
      relations: { tags: true },
    })
    if (!hasProject) {
      throw new EntityNotFoundError(ProjectEntity, { uuid })
    }
    await repo.update(
      { uuid },
      { lastVisited: () => "CURRENT_TIMESTAMP" },
    )
    const entity = await repo.findOneOrFail({
      where: { uuid },
      relations: { tags: true },
    })
    return await _fromTableEntity(entity)
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
      ...dto,
      pinned: false,
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
      ...dto,
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
