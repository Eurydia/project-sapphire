import z from "zod/v4"

export const projectRepositorySchema = z.object({
  name: z.string(),
  uuid: z.uuidv4(),
  url: z.url(),
  createdAt: z.iso.datetime(),
})

export type ProjectRepository = z.infer<
  typeof projectRepositorySchema
>
