import { CreateProjectDto } from "#/models/project/dto/create-project.dto"
import { UpsertProjectDto } from "#/models/project/dto/upsert-project.dto"
import { Project } from "#/models/project/project"
import { existsSync, statSync } from "fs"
import moment from "moment"
import { normalize } from "path"
import { EntityManager, In } from "typeorm"
import { GroupEntity } from "../entity/Group"
import { ProjectEntity } from "../entity/project.entity"
import { TechnologyEntity } from "../entity/Technology"
import { TopicEntity } from "../entity/Topic"

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

export const _fromTableEntity = async (
  entity: ProjectEntity,
) => {
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

export const _fillTags = async (
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
