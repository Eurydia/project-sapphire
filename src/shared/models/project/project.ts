import { z } from "zod/v4"
import { projectTagSchema } from "../project-tag/project-tag-entity"

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
  tags: projectTagSchema.array(),
})

export type Project = z.infer<typeof projectSchema>
