import { uniq } from "lodash"
import z from "zod/v4"

export const projectFormDataSchema = z.object({
  name: z.string().trim().normalize().nonempty(),
  root: z.string().trim().normalize().nonempty(),
  description: z.string().trim().normalize(),
  techNames: z
    .string()
    .trim()
    .nonempty()
    .normalize()
    .array()
    .pipe(z.transform((arg) => uniq(arg))),
  topicNames: z
    .string()
    .trim()
    .nonempty()
    .normalize()
    .array()
    .pipe(z.transform((arg) => uniq(arg))),
  groupNames: z
    .string()
    .trim()
    .normalize()
    .nonempty()
    .array()
    .pipe(z.transform((arg) => uniq(arg))),
})
export type ProjectFormData = z.infer<
  typeof projectFormDataSchema
>
