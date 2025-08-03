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
    tags: stringArraySchema,
  })
  .default({ tags: [], names: [] })

export type ProjectQuery = z.infer<typeof projectQuerySchema>
