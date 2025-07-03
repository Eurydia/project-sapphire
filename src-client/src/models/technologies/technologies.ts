import z from 'zod/v4'

export const technologySchema = z.strictObject({
  uuid: z.uuid(),
  name: z.string().trim().nonempty(),
})

export type Technology = z.infer<typeof technologySchema>
