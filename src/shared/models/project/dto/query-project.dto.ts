import { z } from "zod/v4"

const stringArraySchema = z
  .string()
  .trim()
  .normalize()
  .nonempty()
  .array()
  .default([])

export const projectQuerySchema = z
  .object({
    names: stringArraySchema,
    topics: stringArraySchema,
    techs: stringArraySchema,
    groups: stringArraySchema,
  })
  .default({ groups: [], names: [], techs: [], topics: [] })

export type ProjectQuery = z.infer<typeof projectQuerySchema>
