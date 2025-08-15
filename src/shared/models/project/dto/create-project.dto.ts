import { uniq } from "lodash"
import z from "zod/v4"

export const createProjectDtoSchema = z.object({
  name: z.string().trim().normalize().nonempty(),
  description: z.string().trim().normalize(),
  tagNames: z
    .string()
    .trim()
    .normalize()
    .nonempty()
    .array()
    .pipe(z.transform((arg) => uniq(arg))),
})
export type CreateProjectDto = z.infer<
  typeof createProjectDtoSchema
>
