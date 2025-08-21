import z from "zod/v4"

export const projectWorkspaceUpdateDtoSchema = z.object({
  projectUUID: z.uuidv4(),
  uuid: z.uuidv4(),
  name: z.string().trim().normalize().nonempty(),
  root: z.string().trim().normalize().nonempty(),
})

export type ProjectWorkspaceUpdateDto = z.infer<
  typeof projectWorkspaceUpdateDtoSchema
>
