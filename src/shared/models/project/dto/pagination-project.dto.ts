import { z } from "zod/v4"
import { projectSchema } from "../project"

export const projectPaginationQuerySchema = z.object({
  query: z
    .string()
    .trim()
    .normalize()
    .nonempty()
    .array()
    .default([]),
  pageIndex: z.number().int().nonnegative().default(0),
  resultPerPage: z.number().int().positive().default(5),
})

export type ProjectPaginationQuery = z.infer<
  typeof projectPaginationQuerySchema
>

export const projectPaginationResultSchema = z.object({
  items: projectSchema.array(),
  pageIndex: z.number().int().nonnegative(),
  resultPerPage: z.number().int().positive(),
  totalCount: z.number().int().nonnegative(),
  pageCount: z.number().int().nonnegative(),
})

export type ProjectPaginationResult = z.infer<
  typeof projectPaginationResultSchema
>
