import { existsSync } from "fs";
import { lstat } from "fs/promises";
import { isAbsolute } from "path";

export const getProjectRootMetadata = async (path: string) => {
  if (!isAbsolute(path) || !existsSync(path)) {
    return null;
  }

  const stats = await lstat(path);
  if (!stats.isDirectory()) {
    return null;
  }

  return {
    ctime: stats.ctime,
    atime: stats.atimeMs,
    mtime: stats.mtimeMs,
  };
};
