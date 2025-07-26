import { z } from "zod/v4"
import { projectGroupTableEntitySchema } from "../project-group/group-table-entity"
import { technologySchema } from "../technology/tech-table-entity"
import { topicTableEntitySchema } from "../topic/topic-table.entity"

export const projectRootMetadataSchema = z
  .object({
    atime: z.object({ fromNow: z.string(), exact: z.string() }),
    ctime: z.object({ fromNow: z.string(), exact: z.string() }),
    mtime: z.object({ fromNow: z.string(), exact: z.string() }),
  })
  .readonly()

export const projectSchema = z
  .object({
    uuid: z.uuidv4(),
    name: z.string().normalize().trim().nonempty().nonoptional(),
    pinned: z.boolean(),
    description: z.string().trim().normalize().nullable(),
    root: z.object({
      path: z
        .string()
        .normalize()
        .trim()
        .nonempty()
        .nonoptional(),
      metadata: projectRootMetadataSchema.nullable(),
    }),
    tags: z.object({
      topics: topicTableEntitySchema.array(),
      technologies: technologySchema.array(),
      groups: projectGroupTableEntitySchema.array(),
    }),
  })
  .readonly()

export type ProjectRootMetadata = z.infer<
  typeof projectRootMetadataSchema
>

export type Project = z.infer<typeof projectSchema>
