import moment from 'moment'
import { v4 } from 'uuid'
import { getDb } from './db'
import { addTechManyByName } from './technologies'
import { addTopicManyByName } from './topics'
import { type CreateProjectDto } from './models/project/dto/create-project'
import { z } from 'zod/v4'

export const listProjects = async () => {
  return (await getDb()).getAll('projects')
}

export const getProjectRootMetadata = async (root: string) => {
  const respond = await window.fs.statDir(root)
  const result = z
    .object({
      birthtimeMs: z.number().nonnegative(),
      atimeMs: z.number().nonnegative(),
      mtimeMs: z.number().nonnegative()
    })

    .safeParse(respond)
  if (!result.success) {
    return null
  }

  if (result.data === null) {
    return null
  }
  const { atimeMs, birthtimeMs, mtimeMs } = result.data
  return {
    ctime: { fromNow: moment(birthtimeMs).fromNow(), exact: moment(birthtimeMs).toLocaleString() },
    mtime: { fromNow: moment(mtimeMs).fromNow(), exact: moment(mtimeMs).toLocaleString() },
    atime: { fromNow: moment(atimeMs).fromNow(), exact: moment(atimeMs).toLocaleString() }
  }
}

export const getProjectByUuid = async (uuid: string) => {
  return (await getDb()).get('projects', uuid)
}

export const createProject = async (dto: CreateProjectDto) => {
  const techUuids = await addTechManyByName(dto.techNames)
  const topicUuids = await addTopicManyByName(dto.topicNames)
  return (await getDb()).add('projects', {
    name: dto.name,
    root: dto.root,
    techUuids,
    topicUuids,
    pinned: false,
    uuid: v4()
  })
}

export const pinProject = async (uuid: string) => {
  const db = await getDb()
  const tx = db.transaction('projects', 'readwrite')
  const store = tx.objectStore('projects')

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
  const tx = db.transaction('projects', 'readwrite')
  const store = tx.objectStore('projects')

  const project = await store.get(uuid)
  if (project === undefined) {
    return null
  }
  project.pinned = false
  await store.put(project)
  await tx.done
  return project
}
