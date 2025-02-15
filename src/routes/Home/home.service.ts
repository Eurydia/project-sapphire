import { invoke } from "@tauri-apps/api/core";
import { VaultData } from "./home.entity";

export const getVaultData = async () => {
  const response: VaultData = await invoke("get_vault");
  return response;
};

export const createVaultCollection = async (
  name: string,
  repositories: string[]
) => {
  const result: boolean = await invoke(
    "create_vault_collection",
    {
      name,
      repositories,
    }
  );
  return result;
};
