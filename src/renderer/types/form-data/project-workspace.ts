import { z } from "zod/v4"

export const projectWorkspaceFormDataSchema = z.object({
  name: z.string().trim().normalize().nonempty(),
  root: z.string().trim().normalize().nonempty(),
})

export type ProjectWorkspaceFormData = z.infer<
  typeof projectWorkspaceFormDataSchema
>
