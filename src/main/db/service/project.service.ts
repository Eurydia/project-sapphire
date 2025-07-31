import { In } from "typeorm"
import z4 from "zod/v4"
import { registerIpcMainServices } from "../../services/core"
import { AppDataSource } from "../data-source"
import { GroupEntity } from "../entity/Group"
import {
  createProjectDtoSchema,
  upsertProjectDtoSchema,
} from "../entity/project/dto"
import { ProjectEntity } from "../entity/project/Project"
import { TechnologyEntity } from "../entity/Technology"
import { TopicEntity } from "../entity/Topic"

export const repo = AppDataSource.getRepository(ProjectEntity)

const list = async () => {
  return repo.find()
}
const listByUuids = async (arg: unknown) => {
  const uuids = z4.uuidv4().array().parse(arg)
  return repo.find({
    where: { uuid: In(uuids) },
    order: { name: { direction: "ASC" } },
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
  return repo.find({
    where: { name: In(names) },
    order: { name: { direction: "asc" } },
  })
}

// export const getProjectRootMetadata = async (root: string) => {
//   return statDir(root).then((result) => {
//     if (isLeft(result)) {
//       return null
//     }
//     const { atimeMs, birthtimeMs, mtimeMs } = result.right
//     return {
//       ctime: {
//         fromNow: moment(birthtimeMs).fromNow(),
//         exact: moment(birthtimeMs).toLocaleString(),
//       },
//       mtime: {
//         fromNow: moment(mtimeMs).fromNow(),
//         exact: moment(mtimeMs).toLocaleString(),
//       },
//       atime: {
//         fromNow: moment(atimeMs).fromNow(),
//         exact: moment(atimeMs).toLocaleString(),
//       },
//     }
//   })
// }

export const findByUuid = async (arg: unknown) => {
  const uuid = z4.uuidv4().parse(arg)
  return repo.findOne({ where: { uuid } })
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

    const project = mgr.create(ProjectEntity, {
      name: dto.name,
      root: dto.root,
      pinned: false,
      description: dto.description ?? null,
      topics: [...knownTopics, ...newTopics],
      groups: [...knownGroups, ...newGroups],
      techs: [...knownTechs, ...newTechs],
    })
    return mgr.save(ProjectEntity, project)
  })
}

export const upsertProject = async (arg: unknown) => {
  const dto = upsertProjectDtoSchema.parse(arg)
  return AppDataSource.transaction(async (mgr) => {
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

    const project = mgr.create(ProjectEntity, {
      uuid: dto.uuid,
      name: dto.name,
      root: dto.root,
      pinned: false,
      description: dto.description ?? null,
      topics: [...knownTopics, ...newTopics],
      groups: [...knownGroups, ...newGroups],
      techs: [...knownTechs, ...newTechs],
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
