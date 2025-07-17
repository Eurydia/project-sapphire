import { dialog, shell } from "electron";
import { registerIpcMainServices } from "../core/services/main";

export const openDirDialog = () =>
  dialog.showOpenDialog({ properties: ["openDirectory"] });

export const openPath = (path: string) => shell.openPath(path);

const fs = {
  openDirDialog,
  openPath,
};
export default fs;

export const initFsServices = () => registerIpcMainServices(fs, "fs");
