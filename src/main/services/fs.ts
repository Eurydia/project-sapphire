import { dialog, shell } from "electron"
import { existsSync, lstatSync } from "fs"
import { isAbsolute } from "path"
import { registerIpcMainServices } from "./core"

export const openDirDialog = () =>
  dialog.showOpenDialog({ properties: ["openDirectory"] })

export const openPath = async (path: string) => {
  if (!existsSync(path)) {
    throw `path '${path}' does not exists`
  }
  return shell.openPath(path)
}

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
