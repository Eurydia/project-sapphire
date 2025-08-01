import { z } from "zod/v4"

export const topicDtoSchema = z.object({
  name: z.string(),
  color: z.string().optional(),
})
export type TopicDto = z.infer<typeof topicDtoSchema>
