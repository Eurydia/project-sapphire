import z from "zod/v4"

export const projectRepositoryUpdateDtoSchema = z.object({
  projectUUID: z.uuidv4(),
  uuid: z.uuidv4(),
  name: z.string().trim().normalize().nonempty(),
  description: z.string().trim().normalize().nullable(),
  url: z.url(),
})

export type ProjectRepositoryUpdateDto = z.infer<
  typeof projectRepositoryUpdateDtoSchema
>
