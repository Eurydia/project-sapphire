import { OpenDirDialogResult } from "#/results/open-dir-dialog.result"
import { dialog, shell } from "electron"
import { existsSync } from "fs"
import { join, normalize } from "path"
import { fileURLToPath } from "url"
import { z } from "zod/v4"
import { registerIpcMainServices } from "./core"

const openDirDialog = async () => {
  return dialog.showOpenDialog({
    properties: ["openDirectory"],
  }) satisfies Promise<OpenDirDialogResult>
}
const openPath = async (...segments: string[]) => {
  const path = normalize(join(...segments))

  if (!existsSync(path)) {
    throw `path '${path}' does not exists`
  }
  return shell.openPath(path)
}

const urlToPath = async (arg: unknown) => {
  const url = z.string().trim().normalize().nonempty().parse(arg)
  return fileURLToPath(url)
}

registerIpcMainServices("fs", {
  openDirDialog,
  openPath,
  urlToPath,
})
