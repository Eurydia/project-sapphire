import z from "zod/v4"

export const projectTreeSchema = z.object({
  projectUuid: z.uuidv4(),
  path: z.string().nullable(),
  parentPath: z.string(),
  readme: z
    .object({
      name: z.string(),
      content: z.string().trim().normalize().nullable(),
    })
    .nullable(),
  files: z.string().array(),
  dirs: z.string().array(),
})

export type ProjectTree = z.infer<typeof projectTreeSchema>
