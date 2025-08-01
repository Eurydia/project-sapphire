import {
  CreateProjectDto,
  createProjectDtoSchema,
} from "#/models/project/dto/create-project.dto"
import {
  UpsertProjectDto,
  upsertProjectDtoSchema,
} from "#/models/project/dto/upsert-project.dto"
import { Project } from "#/models/project/project"
import { registerIpcMainServices } from "@/services/core"
import { existsSync, statSync } from "fs"
import moment from "moment"
import { normalize } from "path"
import { EntityManager, In } from "typeorm"
import z4 from "zod/v4"
import { AppDataSource } from "../data-source"
import { GroupEntity } from "../entity/Group"
import { ProjectEntity } from "../entity/project.entity"
import { TechnologyEntity } from "../entity/Technology"
import { TopicEntity } from "../entity/Topic"

export const repo = AppDataSource.getRepository(ProjectEntity)

const _getMetadata = async (root: string) => {
  const path = normalize(root).trim()
  if (!existsSync(path)) {
    return null
  }
  const pathStat = statSync(path)
  if (pathStat.isDirectory()) {
    return null
  }
  const { birthtime, atime, mtime } = pathStat

  return {
    atime: {
      exact: moment(atime).toISOString(),
      fromNow: moment(atime).fromNow(),
    },
    ctime: {
      exact: moment(birthtime).toISOString(),
      fromNow: moment(birthtime).fromNow(),
    },
    mtime: {
      exact: moment(mtime).toISOString(),
      fromNow: moment(mtime).fromNow(),
    },
  } satisfies Project["root"]["metadata"]
}

const _fromTableEntity = async (entity: ProjectEntity) => {
  const {
    description,
    groups,
    name,
    pinned,
    root,
    techs,
    topics,
    uuid,
  } = entity

  const metadata = await _getMetadata(root)

  return {
    uuid,
    name,
    pinned,
    description,
    root: {
      path: root,
      metadata,
    },
    tags: { groups, technologies: techs, topics },
  } satisfies Project
}

const _fillTags = async (
  mgr: EntityManager,
  dto: CreateProjectDto | UpsertProjectDto,
) => {
  const [knownTopics, knownTechs, knownGroups] =
    await Promise.all([
      mgr.find(TopicEntity, {
        where: { name: In(dto.topicNames) },
      }),
      mgr.find(TechnologyEntity, {
        where: { name: In(dto.techNames) },
      }),
      mgr.find(GroupEntity, {
        where: { name: In(dto.groupNames) },
      }),
    ])

  const knownTopicNames = new Set(
    knownTopics.map(({ name }) => name),
  )
  const newTopics = dto.topicNames
    .filter((name) => !knownTopicNames.has(name))
    .map((name) => mgr.create(TopicEntity, { name }))

  const knownTechNames = new Set(
    knownTechs.map(({ name }) => name),
  )
  const newTechs = dto.techNames
    .filter((name) => !knownTechNames.has(name))
    .map((name) => mgr.create(TechnologyEntity, { name }))

  const knownGroupNames = new Set(
    knownGroups.map(({ name }) => name),
  )
  const newGroups = dto.groupNames
    .filter((name) => !knownGroupNames.has(name))
    .map((name) => mgr.create(GroupEntity, { name }))

  return {
    topics: [...knownTopics, ...newTopics],
    groups: [...knownGroups, ...newGroups],
    techs: [...knownTechs, ...newTechs],
  }
}

const list = () => {
  return AppDataSource.transaction(async (mgr) => {
    const entities = await mgr.find(ProjectEntity)
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

export const findByUuid = async (arg: unknown) => {
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

export const pin = async (arg: unknown) => {
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

export const unpin = async (arg: unknown) => {
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

export const createProject = async (arg: unknown) => {
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

export const upsertProject = async (arg: unknown) => {
  const dto = upsertProjectDtoSchema.parse(arg)
  return AppDataSource.transaction(async (mgr) => {
    const { groups, techs, topics } = await _fillTags(mgr, dto)
    const project = mgr.create(ProjectEntity, {
      uuid: dto.uuid,
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
