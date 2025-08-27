import { OpenDirDialogResult } from "#/results/open-dir-dialog.result"
import { app, dialog, shell } from "electron"
import { existsSync, readFileSync, statSync } from "fs"
import { join, normalize } from "path"
import { z } from "zod/v4"
import { registerIpcMainServices } from "./core"

const readFileContent = async () => {
  const result = await dialog.showOpenDialog({
    properties: ["dontAddToRecent", "openFile"],
  })

  if (result.canceled) {
    return null
  }

  const filePath = result.filePaths.at(0)
  if (filePath === undefined) {
    return null
  }

  const fileStat = statSync(filePath)
  if (!fileStat.isFile()) {
    return null
  }

  const content = readFileSync(filePath)
  return String(content)
}

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

const openURL = async (arg: unknown) => {
  const url = z.url().parse(arg)
  return shell.openExternal(url, {})
}

const openDatabasePath = async () => {
  return shell.openPath(join(app.getPath("userData"), "db"))
}

registerIpcMainServices("fs", {
  openDirDialog,
  openPath,
  openURL,
  openDatabasePath,
  readFileContent,
})
