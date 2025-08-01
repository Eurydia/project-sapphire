import { z } from "zod/v4"
import { projectGroupSchema } from "../project-group/group-table-entity"
import { technologySchema } from "../technology/tech-table-entity"
import { topicSchema } from "../topic/topic-table.entity"

export const projectSchema = z.object({
  uuid: z.uuidv4(),
  name: z.string().normalize().trim().nonempty(),
  pinned: z.boolean(),
  description: z.string().trim().normalize(),
  root: z.object({
    path: z.string().normalize().trim().nonempty().nonoptional(),
    metadata: z
      .object({
        atime: z.object({
          fromNow: z.string(),
          exact: z.string(),
        }),
        ctime: z.object({
          fromNow: z.string(),
          exact: z.string(),
        }),
        mtime: z.object({
          fromNow: z.string(),
          exact: z.string(),
        }),
      })
      .nullable(),
  }),
  tags: z.object({
    topics: topicSchema.array(),
    technologies: technologySchema.array(),
    groups: projectGroupSchema.array(),
  }),
})

export type Project = z.infer<typeof projectSchema>
