import { z } from "zod/v4"

export const updateProjectTagDtoSchema = z.object({
  uuid: z.uuidv4(),
  name: z.string().trim().nonempty().normalize(),
  description: z.string().trim().normalize(),
})

export type UpdateProjectTagDto = z.infer<
  typeof updateProjectTagDtoSchema
>
