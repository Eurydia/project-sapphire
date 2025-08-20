import { OpenDirDialogResult } from "#/results/open-dir-dialog.result"
import { dialog, shell } from "electron"
import { existsSync } from "fs"
import { join, normalize } from "path"
import { z } from "zod/v4"
import { registerIpcMainServices } from "./core"

const openDirDialog = async (arg: unknown) => {
  const options = z
    .object({
      title: z.string().trim().normalize().nonempty().optional(),
      message: z
        .string()
        .trim()
        .normalize()
        .nonempty()
        .optional(),
      defaultPath: z
        .string()
        .trim()
        .normalize()
        .nonempty()
        .optional(),
    })
    .default({})
    .parse(arg)
  return dialog.showOpenDialog({
    properties: [
      "openDirectory",
      "multiSelections",
      "dontAddToRecent",
    ],
    ...options,
  }) satisfies Promise<OpenDirDialogResult>
}
const openPath = async (...args: unknown[]) => {
  const segments = z
    .string()
    .trim()
    .normalize()
    .nonempty()
    .array()
    .parse(args)
  const path = normalize(join(...segments))

  if (!existsSync(path)) {
    throw `path '${path}' does not exists`
  }
  return shell.openPath(path)
}

registerIpcMainServices("fs", {
  openDirDialog,
  openPath,
})
