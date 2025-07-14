import z from "zod/v4";
import { technologySchema } from "~/models/technologies/technologies";
import { topicSchema } from "~/models/topics/topic";

export const projectSchema = z.looseObject({
  name: z.string().trim().nonempty(),
  root: z.string().trim().nonempty(),
  description: z.string().trim().optional(),
  uuid: z.uuid(),
  technologies: technologySchema.array(),
  topics: topicSchema.array(),
  metadata: z
    .looseObject({
      atime: z.object({ fromNow: z.string() }),
      ctime: z.object({ fromNow: z.string() }),
      mtime: z.object({ fromNow: z.string() }),
    })
    .nullable()
    .optional(),
  pinned: z.boolean(),
});

export type Project = z.infer<typeof projectSchema>;
