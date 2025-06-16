import { NotAcceptableException } from "@nestjs/common";
import { realpath } from "node:fs/promises";
import { isAbsolute, normalize, relative, resolve, sep } from "node:path";

export const pathSafeJoin = async (root: string, ...paths: string[]) => {
  const rawRoot = normalize(root);
  const realRoot = await realpath(rawRoot);

  const rawTarget = normalize(resolve(rawRoot, ...paths));
  const realTarget = await realpath(rawTarget);

  if (!realTarget.startsWith(realRoot + sep)) {
    throw new NotAcceptableException("Access denied");
  }

  const rel = relative(realRoot, realTarget);
  if (rel.startsWith("..") || isAbsolute(rel)) {
    throw new NotAcceptableException("Access denied");
  }

  return { root: realRoot, rest: realTarget };
};
