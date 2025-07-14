import z from "zod/v4";

export const technologySchema = z.looseObject({
  uuid: z.uuid(),
  name: z.string().trim().nonempty(),
  color: z.string().trim(),
});

export type Technology = z.infer<typeof technologySchema>;
