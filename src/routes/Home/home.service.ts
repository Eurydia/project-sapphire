import { invoke } from "@tauri-apps/api/core";
import { RepositoryEntry, VaultData } from "./home.entity";

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
  ).then(
    (result: unknown) => result as boolean,
    () => false
  );
  return result;
};

export const prepareVaultRepository = (
  repositories: RepositoryEntry[]
) => {
  const lookup = new Map<string, RepositoryEntry>();
  for (const repo of repositories) {
    lookup.set(repo.path, repo);
  }
  return lookup;
};
