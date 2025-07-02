import { z } from "zod";

export const technologySchema = z.strictObject({
  id: z.string().uuid(),
  name: z.string().trim().min(1),
});

export type ProjectTechnology = z.infer<typeof technologySchema>;

export const topicSchema = z.strictObject({
  id: z.string().uuid(),
  name: z.string().trim().min(1),
});

export type ProjectTopic = z.infer<typeof topicSchema>;

export const projectSchema = z.strictObject({
  uuid: z.string().uuid(),
  name: z.string().min(1),
  absPath: z.string().min(1),
  description: z.string().nullable(),
  technologies: technologySchema.array(),
  topics: topicSchema.array(),
  metadata: z
    .strictObject({
      ctime: z.string().datetime(),
      atime: z.string().datetime(),
      mtime: z.string().datetime(),
    })
    .nullable(),
});

export type Project = z.infer<typeof projectSchema>;
