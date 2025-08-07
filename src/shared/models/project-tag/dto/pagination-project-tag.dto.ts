import { z } from "zod/v4"
import { projectTagSchema } from "../project-tag-entity"

export const projectTagPaginationQueryDtoSchema = z.object({
  resultsPerPage: z.number().positive().default(5),
  pageIndex: z.number().nonnegative().default(0),
})

export type ProjectTagPaginationQueryDto = z.infer<
  typeof projectTagPaginationQueryDtoSchema
>

export const projectTagPaginationResultDtoSchema = z.object({
  items: projectTagSchema.array(),
  total: z.number().nonnegative(),
  pageIndex: z.number().nonnegative(),
  pageCount: z.number().nonnegative(),
  resultsPerPage: z.number().positive(),
})

export type ProjectTagPaginationResultDto = z.infer<
  typeof projectTagPaginationResultDtoSchema
>
