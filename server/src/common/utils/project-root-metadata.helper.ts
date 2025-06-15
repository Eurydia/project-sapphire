import { existsSync, Stats, statSync } from "fs";
import { isAbsolute } from "path";

export type ProjectRootMetadata = Pick<
  Stats,
  "atimeMs" | "ctimeMs" | "mtimeMs"
>;

export const getProjectRootMetadata = (path: string) => {
  if (!isAbsolute(path) || !existsSync(path)) {
    return null;
  }

  const stats = statSync(path);
  if (!stats.isDirectory()) {
    return null;
  }
  const metadata: ProjectRootMetadata = {
    ctimeMs: stats.ctimeMs,
    atimeMs: stats.atimeMs,
    mtimeMs: stats.mtimeMs,
  };
  return metadata;
};
