import z from 'zod/v4'
import { technologySchema } from '../technologies/technologies'
import { topicSchema } from '../topics/topic'

export const projectSchema = z.object({
  name: z.string().trim().nonempty(),
  root: z.string().trim().nonempty(),
  description: z.string().trim(),
  uuid: z.uuid(),
  technologies: technologySchema.array(),
  topics: topicSchema.array(),
})

export const projectMetadataSchema = z.object({
  atime: z.iso.datetime(),
  ctime: z.iso.datetime(),
  mtime: z.iso.datetime(),
})

export type ProjectMetadata = z.infer<typeof projectMetadataSchema>
export type Project = z.infer<typeof projectSchema>
