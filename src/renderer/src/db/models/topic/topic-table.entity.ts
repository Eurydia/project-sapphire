import z from "zod/v4"

export const topicTableEntitySchema = z.object({
  uuid: z.uuid(),
  name: z.string().trim().nonempty(),
  color: z.string().trim(),
})

export type TopicTableEntity = z.infer<
  typeof topicTableEntitySchema
>
