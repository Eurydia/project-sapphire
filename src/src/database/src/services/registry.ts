import { ipcMain } from "electron";

export type Handler = (...args: unknown[]) => Promise<unknown>;

const handlerRegistry = new Map<string, Handler>();

export const registerHandler = (handler: Handler) => {
  const channel = handler.name;
  if (handlerRegistry.has(channel)) {
    throw new Error(`Handler with channel "${channel}" is already registered.`);
  }
  handlerRegistry.set(channel, handler);
};

export const registerIpcMainHandlers = () => {
  for (const [channel, handler] of handlerRegistry.entries()) {
    ipcMain.handle(channel, async (_, ...args) => handler(...args));
  }
};

export const getRegisteredChannels = () => {
  return [...handlerRegistry.keys()];
};
