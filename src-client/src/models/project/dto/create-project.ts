import { z } from 'zod/v4'
import { projectSchema } from '../project'

export const createProjectDtoSchema = projectSchema
  .omit({
    uuid: true,
    topics: true,
    technologies: true,
    metadata: true,
  })
  .extend({
    topics: z
      .string()
      .trim()
      .nonempty()
      .array()
      .refine(
        (arg) => new Set(arg).size === arg.length,
        'Topics must be unique',
      ),
    technologies: z
      .string()
      .trim()
      .nonempty()
      .array()
      .refine(
        (arg) => new Set(arg).size === arg.length,
        'Technologies must be unique',
      ),
  })
export type CreateProjectDto = z.infer<typeof createProjectDtoSchema>
