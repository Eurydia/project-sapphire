import { isLeft } from "fp-ts/lib/Either"
import moment from "moment"
import { v4 } from "uuid"
import { statDir } from "~/api/fs"
import { getDb } from "./db"
import {
  type ProjectDto,
  type ProjectQuery,
} from "./models/project/dto/project-dto"
import type { Project } from "./models/project/project"
import { type ProjectTableEntity } from "./models/project/project-table-entity"
import { ProjectGroupService } from "./project-groups"
import {
  addTechManyByName,
  listTechManyByUuid,
} from "./technologies"
import {
  addTopicManyByName,
  listTopicManyByUuid,
} from "./topics"

export const listProjectsByNames = async () => {
  const db = await getDb()
  const tx = db.transaction("projects")
  const idx = tx.objectStore("projects").index("by-name")
  return idx.getAll()
}

export const listProjects = async (
  query: ProjectQuery | undefined = undefined,
): Promise<Project[]> => {
  const db = await getDb()
  const tx = db.transaction("projects", "readonly")
  const projectStore = tx.objectStore("projects")
  const entries = await projectStore.getAll()
  await tx.done

  let matchedEntries: typeof entries = entries
  if (query !== undefined) {
    matchedEntries = []
    const queryNames = new Set(query.names)
    const queryTopics = new Set(query.topicTags)
    const queryTechs = new Set(query.techTags)
    const queryGroups = new Set(query.groupTags)
    for (const entry of entries) {
      if (queryNames.size > 0 && !queryNames.has(entry.name)) {
        continue
      }

      const topics = await listTopicManyByUuid(entry.topicUuids)
        .then((result) => result.map(({ name }) => name))
        .then((result) => new Set(result))

      if (
        queryTopics.size > 0 &&
        [...queryTopics].some((tag) => !topics.has(tag))
      ) {
        continue
      }

      const tech = await listTechManyByUuid(entry.techUuids)
        .then((result) => result.map(({ name }) => name))
        .then((result) => new Set(result))

      if (
        queryTechs.size > 0 &&
        [...queryTechs].some((tag) => !tech.has(tag))
      ) {
        continue
      }

      const group = await listTechManyByUuid(entry.techUuids)
        .then((result) => result.map(({ name }) => name))
        .then((result) => new Set(result))

      if (
        queryGroups.size > 0 &&
        [...queryGroups].some((tag) => !group.has(tag))
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

  const projects: Promise<Project>[] = sortedEntries.map(
    async ({
      name,
      pinned,
      root,
      description,
      uuid,
      groupUuids,
      techUuids,
      topicUuids,
    }) => {
      return {
        name,
        pinned,
        root: {
          path: root,
          metadata: await getProjectRootMetadata(root),
        },
        description,
        uuid,
        tags: {
          technologies: await listTechManyByUuid(techUuids),
          topics: await listTopicManyByUuid(topicUuids),
          groups:
            await ProjectGroupService.listByUuids(groupUuids),
        },
      } satisfies Project
    },
  )

  return Promise.all(projects)
}

export const getProjectRootMetadata = async (root: string) => {
  return statDir(root).then((result) => {
    if (isLeft(result)) {
      return null
    }
    const { atimeMs, birthtimeMs, mtimeMs } = result.right
    return {
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
    }
  })
}

export const getProjectByUuid = async (uuid: string) => {
  const db = await getDb()
  const tx = db.transaction("projects", "readonly")
  const store = tx.objectStore("projects")
  const item = await store.get(uuid)

  if (item === undefined) {
    return undefined
  }
  const {
    groupUuids,
    name,
    pinned,
    root,
    techUuids,
    topicUuids,
    description,
  } = item
  const topics = await listTopicManyByUuid(topicUuids)
  const techs = await listTechManyByUuid(techUuids)
  const groups =
    await ProjectGroupService.listByUuids(groupUuids)
  return {
    tags: {
      groups,
      technologies: techs,
      topics,
    },
    uuid,
    name,
    pinned,
    description,
    root: {
      path: root,
      metadata: await getProjectRootMetadata(root),
    },
  } satisfies Project
}

export const createProject = async (dto: ProjectDto) => {
  const techUuids = await addTechManyByName(dto.techNames)
  const topicUuids = await addTopicManyByName(dto.topicNames)
  const groupUuids = await ProjectGroupService.addByNames(
    dto.groupNames,
  )

  const db = await getDb()
  const store = db
    .transaction("projects", "readwrite")
    .objectStore("projects")
  const uuid = await store.add({
    name: dto.name,
    root: dto.root,
    description: dto.description,
    groupUuids,
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
  const groupUuids = await ProjectGroupService.addByNames(
    dto.groupNames,
  )
    .then((r) => r)
    .catch((err) => {
      console.debug(err)
      return []
    })

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
    groupUuids,
    uuid,
  } satisfies ProjectTableEntity

  if (project === undefined) {
    await store.add(entry)
  } else {
    await store.put(entry)
  }
  await tx.done
  return uuid
}
