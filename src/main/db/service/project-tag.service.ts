import { createProjectTagDtoSchema } from "#/models/project-tag/dto/create-project-tag.dto"
import {
  projectTagPaginationQuerySchema,
  ProjectTagPaginationResult,
} from "#/models/project-tag/dto/pagination-project-tag.dto"
import { updateProjectTagDtoSchema } from "#/models/project-tag/dto/update-project-tag.dto"
import { ProjectTag } from "#/models/project-tag/project-tag-entity"
import { EntityNotFoundError, In } from "typeorm"
import { z } from "zod/v4"
import { registerIpcMainServices } from "../../services/core"
import { AppDataSource } from "../data-source"
import { ProjectTagEntity } from "../entity/project-tag.entity"
import { InOrUndefined } from "./helper"
import { extractQuery } from "./project-tag.service.helper"

const repo = AppDataSource.getRepository(ProjectTagEntity)

const list = async (arg: unknown) => {
  const { pageIndex, resultsPerPage, query } =
    projectTagPaginationQuerySchema.parse(arg)
  const { items, total } = await AppDataSource.transaction(
    async (mgr) => {
      const repo = mgr.getRepository(ProjectTagEntity)
      const { names, projectNames } = extractQuery(query)
      const items = await repo.find({
        where: {
          name: InOrUndefined(names),
          projects: { name: InOrUndefined(projectNames) },
        },
        order: { pinned: "DESC", name: "asc" },
        relations: {
          projects: true,
        },
        skip: pageIndex * resultsPerPage,
        take: resultsPerPage,
      })
      const total = await repo.count({
        where: {
          name: InOrUndefined(names),
          projects: { name: InOrUndefined(projectNames) },
        },
      })

      return { items, total }
    },
  )
  const pageCount = Math.ceil(total / resultsPerPage)

  return {
    items,
    total,
    pageCount,
    pageIndex,
    resultsPerPage,
  } satisfies ProjectTagPaginationResult
}

const listNames = async () => {
  const results = await repo.find({
    order: { name: "ASC" },
    select: { name: true },
  })
  return results.map(({ name }) => name)
}

const listByUuids = async (arg: unknown) => {
  const uuids = z.uuidv4().array().parse(arg)
  return repo.find({
    order: { pinned: "desc", name: "ASC" },
    where: { uuid: In(uuids) },
    relations: {
      projects: true,
    },
  })
}

const listByNames = async (arg: unknown) => {
  const names = z
    .string()
    .trim()
    .normalize()
    .nonempty()
    .array()
    .parse(arg)
  return repo.find({
    order: { name: "ASC" },
    where: { name: In(names) },
    relations: {
      projects: true,
    },
  })
}
const findByUUID = async (arg: unknown) => {
  const uuid = z.uuidv4().parse(arg)
  return repo.findOne({
    where: { uuid },
    relations: { projects: true },
  }) satisfies Promise<ProjectTag | null>
}

const create = async (arg: unknown) => {
  const dto = createProjectTagDtoSchema.parse(arg)
  return AppDataSource.transaction(async (mgr) => {
    const repo = mgr.getRepository(ProjectTagEntity)
    const result = await repo.save(
      repo.create({
        name: dto.name,
        description: dto.description,
      }),
    )
    return result.uuid
  })
}

const update = async (arg: unknown) => {
  const dto = updateProjectTagDtoSchema.parse(arg)
  return AppDataSource.transaction(async (mgr) => {
    const repo = mgr.getRepository(ProjectTagEntity)
    const tag = await repo.preload(dto)
    if (tag === undefined) {
      throw new EntityNotFoundError(ProjectTagEntity, dto.uuid)
    }
    return repo.save(tag)
  })
}

const pin = async (arg: unknown) => {
  const uuid = z.uuidv4().parse(arg)
  return AppDataSource.transaction(async (mgr) => {
    const repo = mgr.getRepository(ProjectTagEntity)
    const tag = await repo.preload({ uuid, pinned: true })
    if (tag === undefined) {
      throw new EntityNotFoundError(ProjectTagEntity, uuid)
    }
    return repo.save(tag)
  })
}

const unpin = async (arg: unknown) => {
  const uuid = z.uuidv4().parse(arg)
  return AppDataSource.transaction(async (mgr) => {
    const repo = mgr.getRepository(ProjectTagEntity)
    const tag = await repo.preload({ uuid, pinned: false })
    if (tag === undefined) {
      throw new EntityNotFoundError(ProjectTagEntity, uuid)
    }
    return repo.save(tag)
  })
}

registerIpcMainServices("db$tags", {
  list,
  listNames,
  listByNames,
  listByUuids,
  findByUUID,
  update,
  create,
  pin,
  unpin,
})
