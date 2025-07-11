import { Project } from "../models/project.entity";
import { existsSync, lstatSync } from "fs";
import { isAbsolute } from "path";
import moment from "moment";
import { DATA_SOURCE } from "../data-source";
import { technology$createManyByNames } from "./technology.services";
import { topic$createManyByNames } from "./topic.services";

const REPO = DATA_SOURCE.getRepository(Project);

type Data = {
  name: string;
  root: string;
  description?: string;
  topcis?: string[];
  technologies?: string[];
};

export const project$getMetadata = async (uuid: string) => {
  const p = await REPO.findOne({ where: { uuid } });
  if (p === null) {
    return null;
  }

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

export const project$create = async ({
  name,
  root,
  description,
  technologies: techRaw,
  topcis: topicRaw,
}: Data) => {
  const technologies = await technology$createManyByNames(techRaw ?? []);
  const topics = await topic$createManyByNames(topicRaw ?? []);

  const entry = REPO.create({
    name,
    root,
    description,
  });

  entry.topics = topics;
  entry.technologies = technologies;
  return REPO.save(entry);
};

export const project$getAll = async () => {
  return await REPO.find({
    order: { pinned: "DESC", name: "ASC" },
    relations: {
      technologies: true,
      topics: true,
    },
  });
};

export const project$getByUuid = async (uuid: string) => {
  return REPO.findOne({
    where: { uuid },
    relations: { technologies: true, topics: true },
  });
};

export const project$pin = async (uuid: string) => {
  const project = await REPO.findOne({ where: { uuid } });
  if (project === null) {
    return null;
  }
  project.pinned = true;
  return REPO.save(project);
};

export const project$unpin = async (uuid: string) => {
  const project = await REPO.findOne({ where: { uuid } });
  if (project === null) {
    return null;
  }
  project.pinned = false;
  return REPO.save(project);
};

export const project$update = async (
  uuid: string,
  { name, root, description, technologies: techRaw, topcis: topicRaw }: Data
) => {
  const project = await REPO.findOne({
    where: { uuid },
    relations: { technologies: true, topics: true },
  });
  if (project === null) {
    return null;
  }
  const technologies = await technology$createManyByNames(techRaw ?? []);
  const topics = await topic$createManyByNames(topicRaw ?? []);

  project.name = name;
  project.description = description ?? null;
  project.root = root;
  project.technologies = technologies;
  project.topics = topics;

  return REPO.save(project);
};

export const project$softDelete = async (uuid: string) => {
  return REPO.softDelete({ uuid });
};
