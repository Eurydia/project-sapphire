import { OpenDirDialogResult } from "#/results/open-dir-dialog.result"
import { dialog, shell } from "electron"
import { existsSync } from "fs"
import { join, normalize } from "path"
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

registerIpcMainServices("fs", {
  openDirDialog,
  openPath,
})
