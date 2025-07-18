import { contextBridge, ipcRenderer } from 'electron'

const invokeHandlerProvider = (providerName: string, serviceName: string) => {
  const channel = `${providerName}:${serviceName}`
  return (...args: any[]) => ipcRenderer.invoke(channel, ...args)
}

export const registerIpcRendererServices = (providerName: string) => {
  ipcRenderer
    .invoke(`${providerName}:__getRegisteredServices`)
    .then((resp: any) => {
      const services = JSON.parse(resp) as string[]

      const api = Object.fromEntries(
        services.map((service) => [service, invokeHandlerProvider(providerName, service)])
      )

      contextBridge.exposeInMainWorld(providerName, api)
    })
    .catch((err) => console.warn(err))
}
