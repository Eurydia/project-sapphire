import { CreateProjectDto } from "#/models/project/dto/create-project.dto"
import { UpsertProjectDto } from "#/models/project/dto/upsert-project.dto"
import { Project } from "#/models/project/project"
import moment from "moment"
import { EntityManager, In } from "typeorm"
import { ProjectTagEntity } from "../entities/project-tag.entity"
import { ProjectEntity } from "../entities/project.entity"

// const _getMetadata = async (root: string) => {
//   const path = normalize(root).trim()
//   if (!existsSync(path)) {
//     return null
//   }
//   return null
// const pathStat = statSync(path)
// if (!pathStat.isDirectory()) {
//   return null
// }
// const { birthtime, atime, mtime } = pathStat

// return {
//   atime: {
//     exact: moment(atime).toISOString(),
//     fromNow: moment(atime).fromNow(),
//   },
//   ctime: {
//     exact: moment(birthtime).toISOString(),
//     fromNow: moment(birthtime).fromNow(),
//   },
//   mtime: {
//     exact: moment(mtime).toISOString(),
//     fromNow: moment(mtime).fromNow(),
//   },
// } satisfies Project["root"]["metadata"]
// }

export const _fromTableEntity = async (
  entity: ProjectEntity,
) => {
  const {
    created,
    lastVisited,
    workspaces,
    repositories,
    ...rest
  } = entity

  return {
    ...rest,
    created: moment(created).toISOString(),
    lastVisited:
      lastVisited === null
        ? null
        : moment(lastVisited).toISOString(),
    workspaces: workspaces.map(
      ({ createdAt, lastOpened, ...rest }) => ({
        ...rest,
        createdAt: moment(createdAt).toISOString(),
        lastOpened:
          lastOpened === null
            ? null
            : moment(lastOpened).toISOString(),
      }),
    ),
    repositories: repositories.map(({ createdAt, ...rest }) => ({
      ...rest,
      createdAt: moment(createdAt).toISOString(),
    })),
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
