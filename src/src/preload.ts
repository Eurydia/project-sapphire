import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("db", {
  ping: () => ipcRenderer.invoke("ping"),
});
