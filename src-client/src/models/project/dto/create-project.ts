import { z } from 'zod/v4'

export const createProjectDtoSchema = z.strictObject({
  name: z.string().trim().nonempty(),
  root: z.string().trim().nonempty(),
  description: z.string().trim(),
  technologies: z
    .string()
    .trim()
    .toLowerCase()
    .nonempty()
    .array()
    .refine((arg) => new Set(arg).size === arg.length, ''),
  topics: z
    .string()
    .trim()
    .toLowerCase()
    .nonempty()
    .array()
    .refine((arg) => new Set(arg).size === arg.length, ''),
})
export type CreateProjectDto = z.infer<typeof createProjectDtoSchema>
