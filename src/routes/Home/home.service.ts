import { invoke } from "@tauri-apps/api/core";
import { VaultData } from "./home.entity";

export const getRepositories = async () => {
  const response: VaultData = await invoke("get_vault");
  return response;
};
