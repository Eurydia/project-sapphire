import { invoke } from "@tauri-apps/api/core";
import { DirectoryData } from "~types/directory.types";

export const getDirectory = async (path: string | null) => {
  const response = (await invoke("get_directory", {
    path: path ?? "",
  })) as DirectoryData;
  return response;
};
