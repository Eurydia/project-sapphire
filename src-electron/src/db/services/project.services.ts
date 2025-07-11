import { APP_DATA_SOURCE } from '../data-source'
import { Project } from '../models/project.entity'
import { createManyTech } from './technology.services'
import { createManyTopic } from './topic.services'
import { existsSync, lstatSync } from 'fs'
import { isAbsolute } from 'path'
import moment from 'moment'

const REPO = APP_DATA_SOURCE.getRepository(Project)

type Data = {
  name: string
  root: string
  description?: string
  topcis?: string[]
  technologies?: string[]
}

export const getProjectRootMetadata = (p: Project) => {
  if (!isAbsolute(p.root) || !existsSync(p.root)) {
    return null
  }

  const stats = lstatSync(p.root)
  if (!stats.isDirectory()) {
    return null
  }

  return {
    ctime: { fromNow: moment(stats.birthtime).fromNow() },
    mtime: { fromNow: moment(stats.mtime).fromNow() },
    atime: { fromNow: moment(stats.atime).fromNow() },
  }
}

export const createProject = async ({
  name,
  root,
  description,
  technologies: techRaw,
  topcis: topicRaw,
}: Data) => {
  const technologies = await createManyTech(techRaw ?? [])
  const topics = await createManyTopic(topicRaw ?? [])

  const entry = REPO.create({
    name,
    root,
    description,
  })

  entry.topics = topics
  entry.technologies = technologies
  return REPO.save(entry)
}

export const getAllProject = async () => {
  return await REPO.find({
    order: { pinned: 'DESC', name: 'ASC' },
    relations: {
      technologies: true,
      topics: true,
    },
  })
}

export const getProject = async (uuid: string) => {
  return REPO.findOne({
    where: { uuid },
    relations: { technologies: true, topics: true },
  })
}

export const pinProject = async (uuid: string) => {
  const project = await REPO.findOne({ where: { uuid } })
  if (project === null) {
    return null
  }
  project.pinned = true
  return REPO.save(project)
}

export const unpinProject = async (uuid: string) => {
  const project = await REPO.findOne({ where: { uuid } })
  if (project === null) {
    return null
  }
  project.pinned = false
  return REPO.save(project)
}

export const updateProject = async (
  uuid: string,
  { name, root, description, technologies: techRaw, topcis: topicRaw }: Data,
) => {
  const project = await REPO.findOne({
    where: { uuid },
    relations: { technologies: true, topics: true },
  })
  if (project === null) {
    return null
  }
  const technologies = await createManyTech(techRaw ?? [])
  const topics = await createManyTopic(topicRaw ?? [])

  project.name = name
  project.description = description ?? null
  project.root = root
  project.technologies = technologies
  project.topics = topics

  return REPO.save(project)
}

export const deleteProject = async (uuid: string) => {
  return REPO.softDelete({ uuid })
}
