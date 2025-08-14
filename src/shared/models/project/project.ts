import { z } from "zod/v4"

export const projectSchema = z.strictObject({
  uuid: z.uuidv4(),
  name: z.string().normalize().trim().nonempty(),
  pinned: z.boolean(),
  description: z.string().trim().normalize(),
  created: z.object({ exact: z.string(), fromNow: z.string() }),
  lastVisited: z
    .object({ exact: z.string(), fromNow: z.string() })
    .nullable(),
  root: z.object({
    path: z.string().normalize().trim().nonempty(),
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
  tags: z
    .object({
      name: z.string().trim().nonempty().normalize(),
      uuid: z.uuidv4(),
      description: z.string().trim().normalize(),
    })
    .array(),
})

export type Project = z.infer<typeof projectSchema>
