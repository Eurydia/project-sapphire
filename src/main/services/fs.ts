import { dialog, shell } from "electron"
import { lstatSync } from "fs"
import { isAbsolute } from "path"
import { registerIpcMainServices } from "./core"

export const openDirDialog = () =>
  dialog.showOpenDialog({ properties: ["openDirectory"] })
export const openPath = (path: string) => shell.openPath(path)
export const statDir = async (path: string) => {
  if (!isAbsolute(path)) {
    throw new Error(`path '${path}' is illegal (not absolute)`)
  }
  const pathStat = lstatSync(path)
  if (!pathStat.isDirectory()) {
    throw new Error(`path '${path}' is not a directory`)
  }
  return pathStat
}

export const initFsServices = () =>
  registerIpcMainServices("fs", {
    openDirDialog,
    openPath,
    statDir,
  })
