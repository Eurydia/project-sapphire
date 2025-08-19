import { z } from "zod/v4"

const nameString = z.string().trim().normalize().nonempty()
const descString = z.string().trim().normalize().nullable()
export const projectSchema = z.object({
  uuid: z.uuidv4(),
  name: nameString,
  pinned: z.boolean(),
  description: descString,
  created: z.iso.datetime(),
  lastVisited: z.iso.datetime().nullable(),
  tags: z
    .object({
      uuid: z.uuidv4(),
      name: nameString,
      description: descString,
    })
    .array(),
  workspaces: z
    .object({
      uuid: z.uuidv4(),
      name: nameString,
      root: z.string().trim().normalize().nonempty(),
      createdAt: z.iso.datetime().nullable(),
      lastOpened: z.iso.datetime().nullable(),
      description: descString,
    })
    .array(),
})

export type Project = z.infer<typeof projectSchema>
