export type HomeLoaderData = {
  data: VaultData;
  repositoryLookup: Map<string, RepositoryEntry>;
};

export type VaultData = {
  name: string;
  repositories: RepositoryEntry[];
  config: VaultConfig;
};

export type RepositoryEntry = {
  path: string;
  name: string;
  description: string | null;
  created_at: number | null;
  last_accessed: number | null;
  last_modified: number | null;
};

export type VaultConfig = {
  collections: Record<string, string[]>;
};
