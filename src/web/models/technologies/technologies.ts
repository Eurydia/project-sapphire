import z from 'zod/v4'
import { isHexColor } from '../common/hex-color'

export const technologySchema = z.object({
  uuid: z.uuid(),
  name: z.string().trim().nonempty(),
  color: z
    .string()
    .trim()
    .refine((arg) => isHexColor(arg), 'not a valid hex code'),
})

export type Technology = z.infer<typeof technologySchema>
