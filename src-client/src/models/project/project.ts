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
      atime: z.object({ fromNow: z.string() }),
      ctime: z.object({ fromNow: z.string() }),
      mtime: z.object({ fromNow: z.string() }),
    })
    .nullable(),
  pinned: z.boolean(),
})

export type Project = z.infer<typeof projectSchema>
