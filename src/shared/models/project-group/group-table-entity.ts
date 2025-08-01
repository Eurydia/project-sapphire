import { z } from "zod/v4"

export const projectGroupSchema = z.object({
  uuid: z.uuidv4(),
  name: z.string().trim().normalize().nonempty(),
  description: z.string().trim().normalize(),
  color: z.string(),
})

export type ProjectGroup = z.infer<typeof projectGroupSchema>
