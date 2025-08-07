import { z } from "zod/v4"

export const createProjectTagDtoSchema = z.object({
  name: z.string().trim().nonempty().normalize(),
  description: z.string().trim().normalize(),
})

export type CreateProjectTagDto = z.infer<
  typeof createProjectTagDtoSchema
>
