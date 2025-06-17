import { existsSync, lstatSync } from "fs";
import { isAbsolute } from "path";

export const getProjectRootMetadata = (path: string) => {
  if (!isAbsolute(path) || !existsSync(path)) {
    return null;
  }

  const stats = lstatSync(path);
  if (!stats.isDirectory()) {
    return null;
  }

  return {
    ctime: stats.ctime,
    atime: stats.atime,
    mtime: stats.mtime,
  };
};
