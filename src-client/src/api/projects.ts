import { API_CLIENT } from './client'
import type { CreateProjectDto } from '@/models/project/dto/create-project'
import type { UpdateProjectDto } from '@/models/project/dto/update-project'
import type { Project } from '@/models/project/project'
import { projectSchema } from '@/models/project/project'

export const fetchProjectAll = async () => {
  return API_CLIENT.get<Array<Project>>('/projects')
    .then(({ data }) => projectSchema.array().parseAsync(data))
    .catch((err: unknown) => err)
}

export const fetchProject = (uuid: string) =>
  API_CLIENT.get(`/projects/${uuid}`)
    .then(({ data }) => projectSchema.nullable().parseAsync(data))
    .catch(() => null)

export const postProject = (dto: CreateProjectDto) =>
  API_CLIENT.post(`/projects`, dto)

export const putProject = (uuid: string, dto: UpdateProjectDto) =>
  API_CLIENT.put(`/projects/${uuid}`, dto)

export const pinProject = (uuid: string) =>
  API_CLIENT.post(`/projects/${uuid}/pin`)

export const unpinProject = (uuid: string) =>
  API_CLIENT.post(`/projects/${uuid}/unpin`)
