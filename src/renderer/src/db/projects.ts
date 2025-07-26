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
  projectTableEntitySchema,
  type ProjectWithMetadata,
} from "./models/project/project-table-entity"
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
): Promise<Either<Error, ProjectWithMetadata>[]> => {
  const db = await getDb()
  const tx = db.transaction(
    ["projects", "technologies", "topics"],
    "readonly",
  )

  const projectStore = tx.objectStore("projects")

  const entries = await projectStore.getAll()

  await tx.done

  let matchedEntries: typeof entries = entries
  if (query !== undefined) {
    matchedEntries = []
    const queryNames = new Set(query.names)
    const queryTopics = new Set(query.topicTags)
    const queryTechs = new Set(query.techTags)

    for (const entry of entries) {
      if (queryNames.size > 0 && !queryNames.has(entry.name)) {
        continue
      }

      const topics = await listTopicManyByUuids(entry.topicUuids)
        .then((result) => result.map(({ name }) => name))
        .then((result) => new Set(result))

      if (
        queryTopics.size > 0 &&
        [...queryTopics].some((tag) => !topics.has(tag))
      ) {
        continue
      }

      const tech = await listTechManyByUuids(entry.techUuids)
        .then((result) => result.map(({ name }) => name))
        .then((result) => new Set(result))

      if (
        queryTechs.size > 0 &&
        [...queryTechs].some((tag) => !tech.has(tag))
      ) {
        continue
      }
      matchedEntries.push(entry)
    }
  }

  const sortedEntries = matchedEntries.toSorted((a, b) => {
    return (
      Number(b.pinned) - Number(a.pinned) ||
      b.name.localeCompare(a.name)
    )
  })

  return (
    await Promise.allSettled(
      sortedEntries.map(async (entry) => ({
        ...entry,
        metadata: await getProjectRootMetadata(entry.root),
      })),
    )
  ).map((result) =>
    result.status === "fulfilled"
      ? right(result.value)
      : left(result.reason),
  )
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
    .then(projectTableEntitySchema.parseAsync)
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
    pinned: false,
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
  project.pinned = true
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
  project.pinned = false
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
    pinned: project === undefined ? false : project.pinned,
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
