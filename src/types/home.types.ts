export type HomeLoaderData = {
  data: VaultData;
};

export type VaultData = {
  name: string;
  repositories: string[];
  config: VaultConfig;
};

export type VaultConfig = {
  collections: Record<string, string[]>;
};
