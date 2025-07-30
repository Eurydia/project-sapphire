import { contextBridge, ipcRenderer } from "electron"
import { registerIpcRendererServices } from "./register"

registerIpcRendererServices("fs")
contextBridge.exposeInMainWorld("text", {
  ping: () => ipcRenderer.invoke("ping"),
})
