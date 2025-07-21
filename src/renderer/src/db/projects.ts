import moment from "moment"
import {
  isLeft,
  left,
  right,
  type Either,
} from "fp-ts/lib/Either"
import { v4 } from "uuid"
import { getDb } from "./db"
import { type ProjectDto } from "./models/project/dto/project-dto"
import {
  projectSchema,
  type Project,
} from "./models/project/project"
import { addTechManyByName } from "./technologies"
import { addTopicManyByName } from "./topics"
import { statDir } from "~/api/fs"

export const listProjects = async (): Promise<
  Either<
    Error,
    (Project & {
      metadata: ReturnType<typeof getProjectRootMetadata>
    })[]
  >
> => {
  return getDb()
    .then((db) => db.getAll("projects"))
    .then((result) => projectSchema.array().parseAsync(result))
    .then((result) =>
      right(
        result.map((item) => ({
          ...item,
          metadata: getProjectRootMetadata(item.root),
        })),
      ),
    )
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
  return (await getDb()).get("projects", uuid)
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
    return null
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
  return entry
}
