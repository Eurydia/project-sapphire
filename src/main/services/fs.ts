import { dialog, shell } from 'electron'
import { existsSync, lstatSync } from 'fs'
import { isAbsolute } from 'path'
import { registerIpcMainServices } from './core'

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
