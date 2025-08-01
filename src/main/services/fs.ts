import { dialog, shell } from "electron"
import {
  existsSync,
  lstatSync,
  readdirSync,
  readFileSync,
  statSync,
} from "fs"
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

const statDir = async (path: string) => {
  const pathStat = lstatSync(path)
  if (!pathStat.isDirectory()) {
    throw new Error(`path '${path}' is not a directory`)
  }
  return pathStat
}

const readDir = async (root: string, ...segments: string[]) => {
  const path = normalize(join(root, ...segments))
  if (!existsSync(path)) {
    throw new Error(`path ${path} does not exist`)
  }
  const pathStat = statSync(path)
  if (!pathStat.isDirectory) {
    throw new Error(`path ${path} is not a directory`)
  }

  const files: string[] = []
  const dirs: string[] = []

  const entries = readdirSync(path, {
    withFileTypes: true,
    recursive: false,
  })
  for (const entry of entries) {
    if (entry.isFile()) {
      files.push(entry.name)
    } else if (entry.isDirectory()) {
      dirs.push(entry.name)
    }
  }

  return {
    path,
    files,
    dirs,
  }
}

const readFile = async (root: string, ...segments: string[]) => {
  const path = normalize(join(root, ...segments))
  if (!existsSync(path)) {
    return null
  }
  const pathStat = statSync(path)
  if (!pathStat.isFile()) {
    return null
  }
  const content = readFileSync(path)
  return String(content)
}

registerIpcMainServices("fs", {
  openDirDialog,
  openPath,
  statDir,
  readDir,
  readFile,
})
