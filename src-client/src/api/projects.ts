import { API_CLIENT } from './client'
import type { CreateProjectDto } from '@/models/project/dto/create-project'
import type { Project } from '@/models/project/project'
import type { AxiosError } from 'axios'
import type { ZodError } from 'zod/v4'
import { projectSchema } from '@/models/project/project'

export const fetchProjectAll = async () => {
  return API_CLIENT.get<Array<Project>>('/projects')
    .then(({ data }) => projectSchema.array().parseAsync(data))
    .catch((err) => {
      console.debug(err)
      return null
    })
}

export const fetchProject = (uuid: string) =>
  API_CLIENT.get(`/projects/${uuid}`)
    .then(({ data }) => projectSchema.nullable().parseAsync(data))
    .catch((err) => {
      console.warn(err)
      return null
    })

export const postProject = (dto: CreateProjectDto) =>
  API_CLIENT.post(`/projects`, dto)
