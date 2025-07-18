import { dialog, shell } from 'electron'
import { registerIpcMainServices } from './core'
import { existsSync, lstat, lstatSync } from 'fs'
import { isAbsolute } from 'path'

export const openDirDialog = () => dialog.showOpenDialog({ properties: ['openDirectory'] })
export const openPath = (path: string) => shell.openPath(path)
export const statDir = async (path: string) => {
  if (!isAbsolute(path) || !existsSync(path)) {
    return null
  }
  const pathStat = lstatSync(path)
  if (!pathStat.isDirectory()) {
    return null
  }
  return pathStat
}

export const initFsServices = () =>
  registerIpcMainServices('fs', {
    openDirDialog,
    openPath,
    statDir
  })
