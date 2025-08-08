import { z } from "zod/v4"

export const projectTagFormDataSchema = z.object({
  name: z.string().trim().nonempty().normalize(),
  description: z.string().trim().normalize(),
})

export type ProjectTagFormData = z.infer<
  typeof projectTagFormDataSchema
>
