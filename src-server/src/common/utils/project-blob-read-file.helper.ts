import {
  ForbiddenException,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { existsSync } from "fs";
import { lstat, readFile } from "fs/promises";
import { basename, extname, relative } from "path";
import { Project } from "src/api/projects/project.entity";
import { gzipSync } from "zlib";
import { pathSafeJoin } from "./path-safe-join.helper";

export const projectBlobReadFile = async (project: Project, path: string[]) => {
  if (path.includes("..")) {
    throw new NotAcceptableException("Invalid path");
  }

  const { root, rest: target } = await pathSafeJoin(
    project.absPath,
    ...path,
  ).catch((err) => {
    throw err;
  });
  if (!existsSync(target)) {
    throw new NotFoundException("File not found");
  }

  const ext = extname(target).toLowerCase();
  if (ext !== ".md") {
    throw new ForbiddenException("Access to this file type is forbidden");
  }

  const stats = await lstat(target);
  if (!stats.isFile()) {
    throw new ForbiddenException("Target is not a file");
  }

  const fileBuffer = await readFile(target).catch(() => {
    throw new InternalServerErrorException("Cannot read file content");
  });

  const compressedBuffer = gzipSync(fileBuffer);
  const filePath = relative(root, target);
  const fileName = basename(target);

  return {
    content: compressedBuffer,
    metadata: {
      createdAt: stats.ctime,
      modifiedAt: stats.mtime,
      accessedAt: stats.atime,
      size: stats.size,
    },
    path: filePath,
    name: fileName,
    ext,
  };
};
