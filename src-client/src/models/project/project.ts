import z from 'zod/v4'
import { technologySchema } from '../technologies/technologies'
import { topicSchema } from '../topics/topic'

export const projectEntrySchema = z.strictObject({
  name: z.string().trim().nonempty(),
  root: z.string().trim().nonempty(),
  description: z.string(),
  uuid: z.uuid(),
  technologies: technologySchema.array(),
  topics: topicSchema.array(),
})

export const projectSchema = projectEntrySchema.extend({
  metadata: z
    .strictObject({
      atime: z.iso.datetime(),
      ctime: z.iso.datetime(),
      mtime: z.iso.datetime(),
    })
    .nullable(),
})

export type ProjectEntry = z.infer<typeof projectEntrySchema>

export type Project = z.infer<typeof projectSchema>
