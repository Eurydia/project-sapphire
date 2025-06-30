import { z } from "zod/v4";

export const createProjectDtoSchema = z.strictObject({
  name: z.string().trim().nonempty(),
  absPath: z.string().trim().nonempty(),
  description: z.string().trim(),
  topics: z
    .array(z.string().trim().nonempty())
    .refine((items) => new Set(items).size === items.length, {
      error: "Topics must be unique",
    }),
  technologies: z
    .string()
    .trim()
    .nonempty()
    .array()
    .refine((items) => new Set(items).size === items.length, {
      error: "Technologies must be unique",
    }),
});

export type CreateProjectDto = z.infer<typeof createProjectDtoSchema>;
