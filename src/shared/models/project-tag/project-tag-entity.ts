import { z } from "zod/v4"

export const projectTagSchema = z.object({
  uuid: z.uuidv4(),
  name: z.string().trim().normalize().nonempty(),
  description: z.string().trim().normalize(),
  color: z.string(),
})

export type ProjectTag = z.infer<typeof projectTagSchema>
