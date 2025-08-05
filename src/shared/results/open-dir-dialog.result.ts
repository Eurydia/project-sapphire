import { z } from "zod/v4"

export const openDirDialogResultSchema = z.object({
  canceled: z.boolean(),
  filePaths: z.string().array(),
})

export type OpenDirDialogResult = z.infer<
  typeof openDirDialogResultSchema
>
