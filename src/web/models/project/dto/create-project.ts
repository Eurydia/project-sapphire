import { z } from "zod/v4";
import { projectSchema } from "../project";

export const projectDtoSchema = projectSchema
  .pick({
    name: true,
    root: true,
    description: true,
  })
  .extend({
    topics: z
      .string()
      .trim()
      .nonempty()
      .array()
      .refine(
        (arg) => new Set(arg).size === arg.length,
        "Topics must be unique"
      ),
    technologies: z
      .string()
      .trim()
      .nonempty()
      .array()
      .refine(
        (arg) => new Set(arg).size === arg.length,
        "Technologies must be unique"
      ),
  });
export type ProjectDto = z.infer<typeof projectDtoSchema>;
