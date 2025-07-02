import { NotAcceptableException } from "@nestjs/common";
import { realpath } from "node:fs/promises";
import { isAbsolute, normalize, relative, resolve } from "node:path";

export const pathSafeJoin = async (root: string, ...paths: string[]) => {
  const rawRoot = normalize(root);
  const realRoot = await realpath(rawRoot);

  const rawTarget = normalize(resolve(rawRoot, ...paths));
  const realTarget = await realpath(rawTarget);

  if (!realTarget.startsWith(realRoot)) {
    throw new NotAcceptableException(
      "Access denied: target path differs from root",
    );
  }

  const relPath = relative(realRoot, realTarget);
  if (relPath.startsWith("..") || isAbsolute(relPath)) {
    throw new NotAcceptableException(
      "Access denied: joined path contains double dot",
    );
  }

  return { root: realRoot, rest: realTarget, relPath };
};
