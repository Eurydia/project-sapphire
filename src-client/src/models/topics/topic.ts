import z from 'zod/v4'

export const topicSchema = z.object({
  uuid: z.uuid(),
  name: z.string().trim().nonempty(),
})

export type Topic = z.infer<typeof topicSchema>
