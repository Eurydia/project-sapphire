import { z } from "zod/v4"

export const projectGroupTableEntitySchema = z.object({
  uuid: z.uuidv4(),
  name: z.string().trim().normalize().nonempty(),
  description: z.string().trim().normalize().optional(),
  color: z.string(),
})

export type ProjectGroupTableEntity = z.infer<
  typeof projectGroupTableEntitySchema
>
