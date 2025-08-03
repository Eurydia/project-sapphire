import { dialog, shell } from "electron"
import { existsSync } from "fs"
import { join, normalize } from "path"
import { registerIpcMainServices } from "./core"

const openDirDialog = () =>
  dialog.showOpenDialog({ properties: ["openDirectory"] })

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
