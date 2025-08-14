import { z } from "zod/v4"
import { projectTagSchema } from "../project-tag-entity"

export const projectTagPaginationQuerySchema = z.object({
  query: z
    .string()
    .trim()
    .normalize()
    .nonempty()
    .array()
    .default([]),
  resultsPerPage: z.number().positive().default(5),
  pageIndex: z.number().nonnegative().default(0),
})

export type ProjectTagPaginationQuery = z.infer<
  typeof projectTagPaginationQuerySchema
>

export const projectTagPaginationResultSchema = z.object({
  items: projectTagSchema.array(),
  total: z.number().nonnegative(),
  pageIndex: z.number().nonnegative(),
  pageCount: z.number().nonnegative(),
  resultsPerPage: z.number().positive(),
})

export type ProjectTagPaginationResult = z.infer<
  typeof projectTagPaginationResultSchema
>
