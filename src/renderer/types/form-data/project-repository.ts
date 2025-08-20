import { z } from "zod/v4"

export const projectRepositoryFormDataSchema = z.object({
  name: z.string().trim().normalize().nonempty(),
  url: z.url(),
  description: z.string().trim().normalize().nullable(),
})

export type ProjectRepositoryFormData = z.infer<
  typeof projectRepositoryFormDataSchema
>
