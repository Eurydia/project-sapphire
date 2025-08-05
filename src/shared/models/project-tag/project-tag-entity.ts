import { z } from "zod/v4"

export const projectTagSchema = z.strictObject({
  uuid: z.uuidv4(),
  name: z.string().trim().normalize().nonempty(),
  description: z.string().trim().normalize(),
  color: z.string(),
  projects: z
    .object({
      name: z.string().trim().normalize().nonempty(),
      uuid: z.uuidv4(),
    })
    .array(),
})

export type ProjectTag = z.infer<typeof projectTagSchema>
