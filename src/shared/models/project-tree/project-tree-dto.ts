import z from "zod/v4"
import { projectTreeTableEntitySchema } from "./project-tree-table-entity"

export const projectTreeDtoSchema =
  projectTreeTableEntitySchema.pick({
    path: true,
    projectUuid: true,
    readme: true,
  })
export type ProjectTreeDto = z.infer<typeof projectTreeDtoSchema>
