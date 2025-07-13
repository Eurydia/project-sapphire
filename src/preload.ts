import { contextBridge, ipcRenderer } from "electron";

ipcRenderer.invoke("db:getRegisteredChannels").then((channelsRaw: string) => {
  const channels = JSON.parse(channelsRaw) as string[];

  const api: Record<string, unknown> = {};
  for (const channel of channels) {
    api[channel] = (...args: unknown[]) => ipcRenderer.invoke(channel, ...args);
  }
  contextBridge.exposeInMainWorld("db", api);
});
