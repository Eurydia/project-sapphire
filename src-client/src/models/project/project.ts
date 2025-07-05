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
  metadata: z
    .object({
      atime: z.iso.datetime(),
      ctime: z.iso.datetime(),
      mtime: z.iso.datetime(),
    })
    .nullable(),
})

export type Project = z.infer<typeof projectSchema>
