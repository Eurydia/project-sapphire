export type DirectoryLoaderData = {
  data: DirectoryData;
};

export type DirectoryData = {
  vault_name: string;
  path: string;
  files: FileEntry[];
  directories: DirectoryEntry[];
  readme: string | null;
};

export type DirectoryEntry = {
  path: string;
  name: string;
};

export type FileEntry = {
  path: string;
  name: string;
};
