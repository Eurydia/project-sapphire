import { existsSync, lstatSync } from "fs";
import moment from "moment";
import { isAbsolute } from "path";
import { DataSource } from "typeorm";
import { DATA_SOURCE } from "../data-source";
import { Project } from "../models/project.entity";
import { TECH_SERVICES } from "./technology";
import { TOPIC_SERVICES } from "./topic";

const REPO = DATA_SOURCE.getRepository(Project);

type Dto = {
  name: string;
  root: string;
  description?: string;
  topcis?: string[];
  technologies?: string[];
};

const getRootMetadata = async (uuid: string) => {
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

const create = async ({
  name,
  root,
  description,
  technologies: techRaw,
  topcis: topicRaw,
}: Dto) => {
  const technologies = await TECH_SERVICES.createManyByNames(techRaw ?? []);
  const topics = await TOPIC_SERVICES.createManyByNames(topicRaw ?? []);

  const entry = REPO.create({
    name,
    root,
    description,
  });

  entry.topics = topics;
  entry.technologies = technologies;
  return REPO.save(entry);
};

const getAll = async (_: unknown) => {
  return REPO.find({
    order: { pinned: "DESC", name: "ASC" },
    relations: {
      technologies: true,
      topics: true,
    },
  });
};

const getByUuid = async (uuid: string) => {
  return REPO.findOne({
    where: { uuid },
    relations: { technologies: true, topics: true },
  });
};

const pin = async (uuid: string) => {
  const project = await REPO.findOne({ where: { uuid } });
  if (project === null) {
    return null;
  }
  project.pinned = true;
  return REPO.save(project);
};

const unpin = async (uuid: string) => {
  const project = await REPO.findOne({ where: { uuid } });
  if (project === null) {
    return null;
  }
  project.pinned = false;
  return REPO.save(project);
};

const update = async (
  uuid: string,
  { name, root, description, technologies: techRaw, topcis: topicRaw }: Dto
) => {
  const project = await REPO.findOne({
    where: { uuid },
    relations: { technologies: true, topics: true },
  });
  if (project === null) {
    return null;
  }
  const technologies = await TECH_SERVICES.createManyByNames(techRaw ?? []);
  const topics = await TOPIC_SERVICES.createManyByNames(topicRaw ?? []);

  project.name = name;
  project.description = description ?? null;
  project.root = root;
  project.technologies = technologies;
  project.topics = topics;

  return REPO.save(project);
};

const softDelete = async (uuid: string) => {
  return REPO.softDelete(uuid);
};

const getTableShape = () => {
  const metadata = DATA_SOURCE.getMetadata(Project);
  console.debug(metadata.columns, metadata.relations);
  return metadata.columns
    .map((col) => ({
      type: col.type.toString(),
      name: col.propertyName,
    }))
    .concat(
      metadata.relations.map((rel) => ({
        name: rel.propertyName,
        type: rel.joinTableName,
      }))
    );
};

export const PROJECT_SERVICES = {
  getRootMetadata,
  getAll,
  getByUuid,
  update,
  unpin,
  pin,
  softDelete,
  create,
  getTableShape,
};
