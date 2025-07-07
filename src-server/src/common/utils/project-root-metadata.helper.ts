import { existsSync, lstatSync } from "fs";
import { isAbsolute } from "path";
import moment from "moment";
import { Project } from "src/api/projects/project.entity";

export const getProjectRootMetadata = (p: Project) => {
  if (!isAbsolute(p.root) || !existsSync(p.root)) {
    return null;
  }

  const stats = lstatSync(p.root);
  if (!stats.isDirectory()) {
    return null;
  }

  return {
    ctime: { fromNow: moment(stats.birthtime).fromNow() },
    mtime: { fromNow: moment(stats.mtime).fromNow() },
    atime: { fromNow: moment(stats.atime).fromNow() },
  };
};
