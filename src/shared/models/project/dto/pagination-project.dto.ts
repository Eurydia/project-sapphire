import { z } from "zod/v4"
import { projectSchema } from "../project"

export const projectPaginationQuerySchema = z.object({
  query: z
    .union([
      z
        .string()
        .normalize()
        .trim()
        .nonempty()
        .startsWith("name:"),
      z
        .string()
        .normalize()
        .trim()
        .nonempty()
        .startsWith("tag:"),
    ])
    .array()
    .default([]),
  pageIndex: z.number().int().nonnegative().default(0),
  resultsPerPage: z.number().int().positive().default(5),
  orderBy: z
    .enum(["name", "lastVisited"])
    .default("lastVisited"),
})

export type ProjectPaginationQuery = z.infer<
  typeof projectPaginationQuerySchema
>

export type ProjectPaginationQueryRaw = z.input<
  typeof projectPaginationQuerySchema
>

export const projectPaginationResultSchema = z.object({
  items: projectSchema.array(),
  pageIndex: z.number().int().nonnegative(),
  resultsPerPage: z.number().int().positive(),
  totalCount: z.number().int().nonnegative(),
  pageCount: z.number().int().nonnegative(),
})

export type ProjectPaginationResult = z.infer<
  typeof projectPaginationResultSchema
>
