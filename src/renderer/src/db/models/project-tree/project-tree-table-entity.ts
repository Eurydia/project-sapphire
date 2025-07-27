import { z } from "zod/v4"

export const projectTreeTableEntitySchema = z.object({
  projectUuid: z.uuidv4(),
  path: z.string(),
  readme: z.string().nonempty().nullable(),
})

export type ProjectTreeTableEntity = z.infer<
  typeof projectTreeTableEntitySchema
>
