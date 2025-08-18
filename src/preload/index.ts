import { contextBridge, webUtils } from "electron"
import { registerIpcRendererServices } from "./register"

registerIpcRendererServices("fs")
registerIpcRendererServices("db$project")
registerIpcRendererServices("db$tags")
registerIpcRendererServices("db$project-tree")

contextBridge.exposeInMainWorld("webUtils", {
  getPathForFile: async (f: File) => webUtils.getPathForFile(f),
})
