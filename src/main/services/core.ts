import { app, ipcMain } from "electron"
import { globSync, rmSync, writeFileSync } from "fs"
import { join } from "path"

export type ServiceProvider = Record<
  string,
  (...args: any[]) => Promise<any>
>

if (!app.isPackaged) {
  ;(() => {
    const glob = globSync(
      join(
        __dirname,
        "..",
        "..",
        "src",
        "preload",
        "*.gen.d.ts",
      ),
    )
    for (const file of glob) {
      rmSync(file)
    }
  })()
}

const PROVIDER_NAMES: string[] = []

;(() => {
  ipcMain.handle("system$__getIpcMainProviderNames", () => {
    return JSON.stringify(PROVIDER_NAMES)
  })
})()

export const registerIpcMainServices = (
  providerName: string,
  serviceProvider: ServiceProvider,
) => {
  for (const [service, handler] of Object.entries(
    serviceProvider,
  )) {
    ipcMain.handle(`${providerName}:${service}`, (_, ...args) =>
      handler(...args),
    )
  }
  PROVIDER_NAMES.push(providerName)
  ipcMain.handle(`${providerName}$__getRegisteredServices`, () =>
    JSON.stringify(Object.keys(serviceProvider)),
  )

  if (!app.isPackaged) {
    writeFileSync(
      join(
        __dirname,
        "..",
        "..",
        "src",
        "preload",
        `${providerName}.gen.d.ts`,
      ),
      `export declare global {
      interface Window {
        ["${providerName}"]: {
          ${Object.keys(serviceProvider)
            .map(
              (svc) =>
                `${svc}: (...args: any[]) => Promise<unknown>`,
            )
            .join(",")}
        }
      }
    }`,
    )
  }
}
