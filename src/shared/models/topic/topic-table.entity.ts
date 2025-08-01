import z from "zod/v4"

export const topicSchema = z.object({
  uuid: z.uuid(),
  name: z.string().trim().nonempty(),
  color: z.string().trim(),
})

export type Topic = z.infer<typeof topicSchema>
