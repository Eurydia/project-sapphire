import { NotAcceptableException } from "@nestjs/common";
import { existsSync } from "fs";
import { lstat, readdir, stat } from "fs/promises";
import { join, normalize, resolve, sep } from "path";
import { Project } from "src/api/projects/project.entity";

export const projectTreeReadDir = async (project: Project, path: string[]) => {
  if (path.includes("..")) {
    throw new NotAcceptableException("Invalid path");
  }

  const targetDir = normalize(resolve(project.root, ...path));
  const rootDir = normalize(project.root);
  if (!targetDir.startsWith(rootDir)) {
    throw new NotAcceptableException("Access denied");
  }

  if (!existsSync(targetDir)) {
    throw new NotAcceptableException("Directory not found");
  }

  const dirStats = await stat(targetDir).catch(() => {
    throw new NotAcceptableException("Cannot access filesystem");
  });
  if (!dirStats.isDirectory()) {
    throw new NotAcceptableException("Not a directory");
  }

  const currentDirData: {
    path: string;
    name: string;
    metadata: null | {
      createdAt: string;
      modifiedAt: string;
      accessedAt: string;
    };
  } = {
    path: path.join(sep) || "/",
    name: path.length === 0 ? "" : path.at(-1)!,
    metadata: {
      createdAt: dirStats.birthtime.toISOString(),
      modifiedAt: dirStats.mtime.toISOString(),
      accessedAt: dirStats.atime.toISOString(),
    },
  };

  const entries = await readdir(targetDir, { withFileTypes: true }).catch(
    () => {
      throw new NotAcceptableException("Cannot read directory");
    },
  );

  const files: (typeof currentDirData)[] = [];
  const directories: (typeof currentDirData)[] = [];

  for (const entry of entries) {
    const full = resolve(targetDir, entry.name);
    const stat = await lstat(full).catch(() => null);
    if (stat === null) {
      continue;
    }
    const metadata: (typeof currentDirData)["metadata"] = {
      createdAt: stat.birthtime.toISOString(),
      modifiedAt: stat.mtime.toISOString(),
      accessedAt: stat.atime.toISOString(),
    };
    const entryWithMetadata = {
      path: join(...path, entry.name),
      name: entry.name,
      metadata,
    };

    if (entry.isDirectory()) {
      directories.push(entryWithMetadata);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      files.push(entryWithMetadata);
    }
  }

  return { ...currentDirData, files, directories };
};
