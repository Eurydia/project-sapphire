import { contextBridge, ipcRenderer } from "electron";

ipcRenderer.invoke("db:getRegisteredChannels").then((services: string) => {
  const providers = JSON.parse(services) as {
    provider: string;
    services: string[];
  }[];

  const api: Record<string, Record<string, any>> = Object.fromEntries(
    providers.map(({ provider, services }) => [
      provider,
      Object.fromEntries(
        services.map((service) => [
          service,
          (...args: unknown[]) =>
            ipcRenderer.invoke(`${provider}:${service}`, ...args),
        ])
      ),
    ])
  );
  contextBridge.exposeInMainWorld("db", api);
});
