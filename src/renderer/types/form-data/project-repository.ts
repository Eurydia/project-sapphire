import { z } from "zod/v4"

export const projectRepositoryFormDataSchema = z.object({
  name: z.string().trim().normalize().nonempty(),
  url: z.url(),
})

export type ProjectRepositoryFormData = z.infer<
  typeof projectRepositoryFormDataSchema
>
