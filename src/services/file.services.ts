import { invoke } from "@tauri-apps/api/core";
import { FileData } from "~types/file.types";

export const getFileData = async (path: string) => {
  const data = (await invoke("get_file", {
    path,
  })) as FileData;
  return data;
};
