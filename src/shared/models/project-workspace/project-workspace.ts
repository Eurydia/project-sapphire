import z from "zod/v4"

export const projectWorkspaceSchema = z.object({
  name: z.string(),
  uuid: z.uuidv4(),
  root: z.string(),
  createdAt: z.iso.datetime(),
})

export type ProjectWorkspace = z.infer<
  typeof projectWorkspaceSchema
>
