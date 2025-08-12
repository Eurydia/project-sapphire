import { CreateProjectDto } from "#/models/project/dto/create-project.dto"
import { UpsertProjectDto } from "#/models/project/dto/upsert-project.dto"
import { Project } from "#/models/project/project"
import { existsSync, statSync } from "fs"
import moment from "moment"
import { normalize } from "path"
import { EntityManager, In } from "typeorm"
import { ProjectTagEntity } from "../entity/project-tag.entity"
import { ProjectEntity } from "../entity/project.entity"

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
  const { root, ...rest } = entity
  const metadata = await _getMetadata(root)

  return {
    ...rest,
    root: {
      path: root,
      metadata,
    },
  } satisfies Project
}

export const _fillTags = async (
  mgr: EntityManager,
  dto: CreateProjectDto | UpsertProjectDto,
) => {
  const repo = mgr.getRepository(ProjectTagEntity)
  const { tagNames } = dto

  const known = await repo.find({
    where: { name: In(tagNames) },
  })
  const knownNames = new Set(known.map(({ name }) => name))
  const newNames = tagNames.filter(
    (name) => !knownNames.has(name),
  )
  const added = await Promise.all(
    newNames.map((name) => repo.save(repo.create({ name }))),
  )
  return known.concat(added)
}

export const extractProjectQuery = (fragments: string[]) => {
  const queries = {
    names: { regex: /^name:/i, values: <string[]>[] },
    tagNames: { regex: /^tag:/i, values: <string[]>[] },
  }
  const categories = Object.values(queries)
  for (const fragment of fragments) {
    for (const category of categories) {
      if (category.regex.test(fragment)) {
        category.values.push(
          fragment.replace(category.regex, ""),
        )
        continue
      }
    }
  }
  return Object.fromEntries(
    Object.entries(queries).map(([name, { values }]) => [
      name,
      values,
    ]),
  ) as { [k in keyof typeof queries]: string[] }
}
