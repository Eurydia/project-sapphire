import { DatasourceService } from "./registry";
import { Project } from "../models/project.entity";
import { existsSync, lstatSync } from "fs";
import { isAbsolute } from "path";
import moment from "moment";
import { DATA_SOURCE } from "../data-source";
import { TopicService } from "./topic.services";
import { TechnologyService } from "./technology.services";

const REPO = DATA_SOURCE.getRepository(Project);
const topicSvc = new TopicService();
const techSvc = new TechnologyService();

type Data = {
  name: string;
  root: string;
  description?: string;
  topcis?: string[];
  technologies?: string[];
};

export class ProjectService {
  @DatasourceService()
  async getMetadata(uuid: string) {
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
  }

  @DatasourceService()
  async create({
    name,
    root,
    description,
    technologies: techRaw,
    topcis: topicRaw,
  }: Data) {
    const technologies = await techSvc.createManyByNames(techRaw ?? []);
    const topics = await topicSvc.createManyByNames(topicRaw ?? []);

    const entry = REPO.create({
      name,
      root,
      description,
    });

    entry.topics = topics;
    entry.technologies = technologies;
    return REPO.save(entry);
  }

  @DatasourceService()
  async getAll() {
    return REPO.find({
      order: { pinned: "DESC", name: "ASC" },
      relations: {
        technologies: true,
        topics: true,
      },
    });
  }

  @DatasourceService()
  async getByUuid(uuid: string) {
    return REPO.findOne({
      where: { uuid },
      relations: { technologies: true, topics: true },
    });
  }

  @DatasourceService()
  async project$pin(uuid: string) {
    const project = await REPO.findOne({ where: { uuid } });
    if (project === null) {
      return null;
    }
    project.pinned = true;
    return REPO.save(project);
  }

  @DatasourceService()
  async project$unpin(uuid: string) {
    const project = await REPO.findOne({ where: { uuid } });
    if (project === null) {
      return null;
    }
    project.pinned = false;
    return REPO.save(project);
  }

  @DatasourceService()
  async update(
    uuid: string,
    { name, root, description, technologies: techRaw, topcis: topicRaw }: Data
  ) {
    const project = await REPO.findOne({
      where: { uuid },
      relations: { technologies: true, topics: true },
    });
    if (project === null) {
      return null;
    }
    const technologies = await techSvc.createManyByNames(techRaw ?? []);
    const topics = await topicSvc.createManyByNames(topicRaw ?? []);

    project.name = name;
    project.description = description ?? null;
    project.root = root;
    project.technologies = technologies;
    project.topics = topics;

    return REPO.save(project);
  }

  @DatasourceService()
  async softDelete(uuid: string) {
    return REPO.softDelete({ uuid });
  }
}
