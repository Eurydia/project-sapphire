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
  tags: z
    .object({
      name: z.string().trim().nonempty().normalize(),
      uuid: z.uuidv4(),
      description: z.string().trim().normalize(),
    })
    .array(),
})

export type Project = z.infer<typeof projectSchema>
