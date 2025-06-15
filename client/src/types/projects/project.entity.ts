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
      ctimeMs: z.number().nonnegative(),
      atimeMs: z.number().nonnegative(),
      mtimeMs: z.number().nonnegative(),
    })
    .nullable(),
});

export type Project = z.infer<typeof projectSchema>;

export type ProjectQuery = {
  name?: string;
  technologies?: string[];
  topics?: string[];
  status?: string;
  visibility?: string;
};
