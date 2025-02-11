export type HomeLoaderData = {
  data: VaultData;
};

export type VaultData = {
  name: string;
  repositories: RepositoryEntry[];
};

export type RepositoryEntry = {
  path: string;
  name: string;
};
