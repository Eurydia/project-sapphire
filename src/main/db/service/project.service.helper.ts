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
  if (!pathStat.isDirectory()) {
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
  const topics = await (async () => {
    const repo = mgr.getRepository(TopicEntity)
    const names = dto.topicNames

    const known = await repo.find({
      where: { name: In(names) },
    })
    const knownNames = new Set(known.map(({ name }) => name))
    const newNames = names.filter(
      (name) => !knownNames.has(name),
    )
    const added = await Promise.all(
      newNames.map((name) => repo.save(repo.create({ name }))),
    )
    return known.concat(added)
  })()

  const techs = await (async () => {
    const repo = mgr.getRepository(TechnologyEntity)
    const names = dto.techNames

    const known = await repo.find({
      where: { name: In(names) },
    })
    const knownNames = new Set(known.map(({ name }) => name))
    const newNames = names.filter(
      (name) => !knownNames.has(name),
    )
    const added = await Promise.all(
      newNames.map((name) => repo.save(repo.create({ name }))),
    )
    return known.concat(added)
  })()

  const groups = await (async () => {
    const repo = mgr.getRepository(GroupEntity)
    const names = dto.groupNames

    const known = await repo.find({
      where: { name: In(names) },
    })
    const knownNames = new Set(known.map(({ name }) => name))
    const newNames = names.filter(
      (name) => !knownNames.has(name),
    )
    const added = await Promise.all(
      newNames.map((name) => repo.save(repo.create({ name }))),
    )
    return known.concat(added)
  })()

  return {
    topics,
    techs,
    groups,
  }
}
