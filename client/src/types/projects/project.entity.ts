import { z } from "zod";

export const projectTechnologySchema = z.strictObject({
  id: z.string().uuid(),
  name: z.string().trim().min(1),
});

export type ProjectTechnology = z.infer<typeof projectTechnologySchema>;

export const projectTopicSchema = z.strictObject({
  id: z.string().uuid(),
  name: z.string().trim().min(1),
});

export type ProjectTopic = z.infer<typeof projectTopicSchema>;

export const projectSchema = z.strictObject({
  id: z.string().uuid(),
  name: z.string().min(1),
  absPath: z.string().min(1),
  description: z.string().nullable(),
  technologies: projectTechnologySchema.array(),
  topics: projectTopicSchema.array(),
  metadata: z
    .strictObject({
      ctime: z.string().datetime(),
      atime: z.string().datetime(),
      mtime: z.string().datetime(),
    })
    .nullable(),
});

export type Project = z.infer<typeof projectSchema>;
