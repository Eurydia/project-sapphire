import { z } from "zod/v4"

export const projectRepositoryCreateDtoSchema = z.object({
  projectUUID: z.uuidv4(),
  name: z.string().trim().normalize().nonempty(),
  url: z.url(),
})

export type ProjectRepositoryCreateDto = z.output<
  typeof projectRepositoryCreateDtoSchema
>
