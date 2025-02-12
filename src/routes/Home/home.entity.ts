export type HomeLoaderData = {
  data: VaultData;
};

export type VaultData = {
  name: string;
  repositories: RepositoryEntry[];
  config: VaultConfig;
};

export type RepositoryEntry = {
  path: string;
  name: string;
};

export type VaultConfig = {
  collections: Record<string, string[]>;
};
