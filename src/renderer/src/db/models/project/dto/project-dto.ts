import z from "zod/v4"
import { projectTableEntitySchema } from "../project-table-entity"

export const projectDtoSchema = projectTableEntitySchema
  .pick({
    description: true,
    name: true,
    root: true,
  })
  .extend({
    techNames: z
      .string()
      .trim()
      .nonempty()
      .normalize()
      .array()
      .refine(
        (args) => new Set(args).size === args.length,
        "techs must be unique",
      ),
    topicNames: z
      .string()
      .trim()
      .nonempty()
      .normalize()
      .array()
      .refine(
        (args) => new Set(args).size === args.length,
        "topics must be unique",
      ),
    groupNames: z.string().trim().normalize().nonempty().array(),
  })
export type ProjectDto = z.infer<typeof projectDtoSchema>

export const projectQuerySchema = z.object({
  names: z
    .string()
    .trim()
    .normalize()
    .nonempty()
    .array()
    .default([]),
  techTags: z
    .string()
    .trim()
    .normalize()
    .nonempty()
    .array()
    .default([]),
  topicTags: z
    .string()
    .trim()
    .normalize()
    .nonempty()
    .array()
    .default([]),
})

export type ProjectQuery = z.infer<typeof projectQuerySchema>
