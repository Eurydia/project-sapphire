import z from 'zod/v4'
import { projectSchema } from '../project'

export const ProjectDtoSchema = projectSchema
  .pick({
    description: true,
    name: true,
    root: true
  })
  .extend({
    techNames: z
      .string()
      .trim()
      .nonempty()
      .normalize()
      .array()
      .refine((args) => new Set(args).size === args.length, 'techs must be unique'),
    topicNames: z
      .string()
      .trim()
      .nonempty()
      .normalize()
      .array()
      .refine((args) => new Set(args).size === args.length, 'topics must be unique')
  })
export type ProjectDto = z.infer<typeof ProjectDtoSchema>
