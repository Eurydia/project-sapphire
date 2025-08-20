import { ipcRenderer } from "electron"
import { registerIpcRendererServices } from "./register"

ipcRenderer
  .invoke(`system$__getIpcMainProviderNames`)
  .then((resp) => JSON.parse(resp))
  .then(async (providers: string[]) => {
    await Promise.allSettled(
      providers.map(async (name) =>
        registerIpcRendererServices(name),
      ),
    )
    console.debug(providers)
  })
  .catch((err) => console.warn(err))
