import type { Either } from "fp-ts/lib/Either"
import z from "zod/v4"

export const projectSchema = z.object({
  uuid: z.uuidv4(),
  name: z.string().trim().normalize().nonempty(),
  root: z.string().trim().normalize().nonempty(),
  description: z.string().trim().normalize().optional(),
  topicUuids: z
    .uuidv4()
    .array()
    .refine(
      (arg) => new Set(arg).size === arg.length,
      "topic uuids must be unique",
    ),
  techUuids: z
    .uuidv4()
    .array()
    .refine(
      (arg) => new Set(arg).size === arg.length,
      "tech uuids must be unique",
    ),
  pinned: z.union([z.literal(0), z.literal(1)]),
})

export const projectRootMetadataSchema = z.object({
  atime: z.object({ fromNow: z.string(), exact: z.string() }),
  ctime: z.object({ fromNow: z.string(), exact: z.string() }),
  mtime: z.object({ fromNow: z.string(), exact: z.string() }),
})

export type Project = z.infer<typeof projectSchema>
export type ProjectRootMetadata = z.infer<
  typeof projectRootMetadataSchema
>

export type ProjectWithMetadata = Project & {
  metadata: Promise<Either<Error, ProjectRootMetadata>>
}
