import {
  isLeft,
  left,
  right,
  type Either,
} from "fp-ts/lib/Either"
import moment from "moment"
import { v4 } from "uuid"
import { statDir } from "~/api/fs"
import { getDb } from "./db"
import {
  type ProjectDto,
  type ProjectQuery,
} from "./models/project/dto/project-dto"
import {
  projectSchema,
  type ProjectWithMetadata,
} from "./models/project/project"
import {
  addTechManyByName,
  listTechManyByUuids,
} from "./technologies"
import {
  addTopicManyByName,
  listTopicManyByUuids,
} from "./topics"

export const listProjects = async (
  query: ProjectQuery | undefined = undefined,
): Promise<Either<Error, ProjectWithMetadata[]>> => {
  return getDb()
    .then((db) =>
      db.getAllFromIndex("projects", "by-pinned_name"),
    )
    .then((result) => projectSchema.array().parseAsync(result))
    .then(async (result) => {
      if (query === undefined) {
        return result
      }
      console.debug(JSON.stringify(query))
      const names = new Set(query.names)
      const topicTags = new Set(query.topicTags)
      const techTags = new Set(query.techTags)
      const items: typeof result = []
      for (const item of result) {
        if (names.size > 0 && !names.has(item.name)) {
          continue
        }

        const topics = await listTopicManyByUuids(
          item.topicUuids,
        )
          .then((result) => result.map(({ name }) => name))
          .then((result) => new Set(result))

        if (
          topicTags.size > 0 &&
          [...topicTags].some((tag) => !topics.has(tag))
        ) {
          continue
        }

        const tech = await listTechManyByUuids(item.techUuids)
          .then((result) => result.map(({ name }) => name))
          .then((result) => new Set(result))

        if (
          techTags.size > 0 &&
          [...techTags].some((tag) => !tech.has(tag))
        ) {
          continue
        }
        items.push(item)
      }
      return items
    })
    .then((result) =>
      result.map((item) => ({
        ...item,
        metadata: getProjectRootMetadata(item.root),
      })),
    )
    .then((result) => right(result))
    .catch((err) => left<Error>(err))
}

export const getProjectRootMetadata = async (root: string) => {
  return statDir(root).then((result) => {
    if (isLeft(result)) {
      return result
    }
    const { atimeMs, birthtimeMs, mtimeMs } = result.right
    return right({
      ctime: {
        fromNow: moment(birthtimeMs).fromNow(),
        exact: moment(birthtimeMs).toLocaleString(),
      },
      mtime: {
        fromNow: moment(mtimeMs).fromNow(),
        exact: moment(mtimeMs).toLocaleString(),
      },
      atime: {
        fromNow: moment(atimeMs).fromNow(),
        exact: moment(atimeMs).toLocaleString(),
      },
    })
  })
}

export const getProjectByUuid = async (uuid: string) => {
  return (await getDb())
    .get("projects", uuid)
    .then(projectSchema.parseAsync)
}

export const createProject = async (dto: ProjectDto) => {
  const techUuids = await addTechManyByName(dto.techNames)
  const topicUuids = await addTopicManyByName(dto.topicNames)

  const db = await getDb()
  const store = db
    .transaction("projects", "readwrite")
    .objectStore("projects")
  const uuid = await store.add({
    name: dto.name,
    root: dto.root,
    techUuids,
    topicUuids,
    pinned: 1,
    uuid: v4(),
  })

  return uuid
}

export const pinProject = async (uuid: string) => {
  const db = await getDb()
  const tx = db.transaction("projects", "readwrite")
  const store = tx.objectStore("projects")

  const project = await store.get(uuid)
  if (project === undefined) {
    return null
  }
  project.pinned = 0
  await store.put(project)
  await tx.done
  return project
}

export const unpinProject = async (uuid: string) => {
  const db = await getDb()
  const tx = db.transaction("projects", "readwrite")
  const store = tx.objectStore("projects")

  const project = await store.get(uuid)
  if (project === undefined) {
    throw new Error(`Project with uuid '${uuid}' does not exist`)
  }
  project.pinned = 1
  await store.put(project)
  await tx.done
  return project
}

export const upsertProject = async (
  uuid: string,
  dto: ProjectDto,
) => {
  const techUuids = await addTechManyByName(dto.techNames)
  const topicUuids = await addTopicManyByName(dto.topicNames)

  const db = await getDb()
  const tx = db.transaction("projects", "readwrite")
  const store = tx.objectStore("projects")
  const project = await store.get(uuid)

  const entry = {
    name: dto.name,
    root: dto.root,
    description: dto.description,
    pinned: project === undefined ? 1 : project.pinned,
    techUuids,
    topicUuids,
    uuid,
  }

  if (project === undefined) {
    await store.add(entry)
  } else {
    await store.put(entry)
  }
  await tx.done
  return uuid
}
