import { z } from "zod";

export const entryMetadataSchema = z.strictObject({
  createdAt: z.string().datetime(),
  modifiedAt: z.string().datetime(),
  accessedAt: z.string().datetime(),
});

export const projectTreeSchema = z.strictObject({
  path: z.string(),
  name: z.string(),
  metadata: entryMetadataSchema,
  files: z
    .strictObject({
      metadata: entryMetadataSchema,
      path: z.string(),
      name: z.string(),
    })
    .array(),
  directories: z
    .strictObject({
      metadata: entryMetadataSchema,
      path: z.string(),
      name: z.string(),
    })
    .array(),
  readme: z
    .strictObject({
      name: z.string(),
      path: z.string(),
      content: z.string().nullable(),
    })
    .optional(),
});

export type ProjectTree = z.infer<typeof projectTreeSchema>;
