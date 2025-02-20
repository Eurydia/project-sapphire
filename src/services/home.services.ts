import { invoke } from "@tauri-apps/api/core";
import { VaultData } from "~types/home.types";

export const getVault = async () => {
  const response: VaultData | null = await invoke(
    "get_vault"
  );
  return response;
};

export const putVaultDir = async (path: string) => {
  return invoke("put_vault_dir", { path });
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
