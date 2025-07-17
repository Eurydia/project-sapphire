import { ipcMain } from "electron";

export type ServiceProvider = Record<string, (...args: any[]) => Promise<any>>;

export const registerIpcMainServices = (
  serviceProvider: ServiceProvider,
  providerName: string
) => {
  for (const [service, handler] of Object.entries(serviceProvider)) {
    ipcMain.handle(`${providerName}:${service}`, (_, ...args) =>
      handler(...args)
    );
  }
  ipcMain.handle(`${providerName}:__getRegisteredServices`, () =>
    JSON.stringify(Object.keys(serviceProvider))
  );

  // if (!app.isPackaged) {
  //   writeFileSync(
  //     join(
  //       __dirname,
  //       "..",
  //       "..",
  //       "src",
  //       "web",
  //       "types",
  //       `${providerName}.gen.d.ts`
  //     ),
  //     `export declare global {
  //     interface Window {
  //       ["${providerName}"]: {
  //         ${Object.keys(serviceProvider)
  //           .map((svc) => `${svc}: (...args: any[]) => Promise<unknown>`)
  //           .join(",")}
  //       }
  //     }
  //   }`
  //   );
  // }
};
