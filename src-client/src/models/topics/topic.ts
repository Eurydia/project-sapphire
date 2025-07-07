import z from 'zod/v4'
import { isHexColor } from '../common/hex-color'

export const topicSchema = z.object({
  uuid: z.uuid(),
  name: z.string().trim().nonempty(),
  color: z
    .string()
    .trim()
    .refine((arg) => isHexColor(arg), 'color is not a vlid hex code'),
})

export type Topic = z.infer<typeof topicSchema>
