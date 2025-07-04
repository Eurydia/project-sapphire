import { API_CLIENT } from './client'
import type { CreateProjectDto } from '@/models/project/dto/create-project'
import { projectSchema } from '@/models/project/project'

export const fetchProjectAll = () =>
  API_CLIENT.get('/projects')
    .then(projectSchema.array().parseAsync)
    .catch(() => [])

export const fetchProject = (uuid: string) =>
  API_CLIENT.get(`/project/${uuid}`)
    .then(projectSchema.parseAsync)
    .catch(() => null)

export const postProject = (dto: CreateProjectDto) =>
  API_CLIENT.post(`/projects`, dto)
