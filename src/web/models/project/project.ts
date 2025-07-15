import z from "zod/v4";
import { technologySchema } from "~/models/technologies/technologies";
import { topicSchema } from "~/models/topics/topic";

export const projectSchema = z.object({
  name: z.string().trim().nonempty(),
  root: z.string().trim().nonempty(),
  description: z.string().trim().optional(),
  uuid: z.uuid(),
  technologies: technologySchema.array(),
  topics: topicSchema.array(),
  pinned: z.boolean(),
});

export const projectRootMetadataSchema = z.object({
  atime: z.object({ fromNow: z.string() }),
  ctime: z.object({ fromNow: z.string() }),
  mtime: z.object({ fromNow: z.string() }),
});

export const projectWithRootMetadataSchema = projectSchema.extend({
  metadata: projectRootMetadataSchema.nullable(),
});

export type Project = z.infer<typeof projectSchema>;
export type ProjectRootMetadata = z.infer<typeof projectRootMetadataSchema>;
export type ProjectWithRootMetadata = z.infer<
  typeof projectWithRootMetadataSchema
>;
