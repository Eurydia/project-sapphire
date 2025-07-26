import z from "zod/v4"

export const projectTableEntitySchema = z.object({
  uuid: z.uuidv4(),
  name: z.string().trim().normalize().nonempty(),
  root: z.string().trim().normalize().nonempty(),
  description: z.string().trim().normalize().optional(),
  topicUuids: z
    .uuidv4()
    .array()
    .refine(
      (arg) => new Set(arg).size === arg.length,
      "topic uuids must be unique",
    ),
  techUuids: z
    .uuidv4()
    .array()
    .refine(
      (arg) => new Set(arg).size === arg.length,
      "tech uuids must be unique",
    ),
  groupUuids: z.uuidv4().array().default([]),
  pinned: z.coerce.boolean(),
})

export type ProjectTableEntity = z.infer<
  typeof projectTableEntitySchema
>
