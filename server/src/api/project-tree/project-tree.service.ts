import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { readFile } from "fs/promises";
import { basename, extname, sep } from "path";
import { ProjectsService } from "src/api/projects/projects.service";
import { pathSafeJoin } from "src/common/utils/path-safe-join.helper";
import { projectTreeReadDir } from "src/common/utils/project-tree-read-dir.helper";
import { Repository } from "typeorm";
import { ProjectTree } from "./entities/project-tree.entity";

@Injectable()
export class ProjectTreeService {
  constructor(
    private readonly projectsSvc: ProjectsService,
    @InjectRepository(ProjectTree)
    private readonly treeRepo: Repository<ProjectTree>,
  ) {}

  async readDir(projectUUID: string, path: string[]) {
    const project = await this.projectsSvc.findOne(projectUUID);
    if (project === null) {
      throw new NotFoundException("Project not found");
    }

    const tree = await projectTreeReadDir(project, path);
    const { relPath } = await pathSafeJoin(project.absPath, ...path);
    let node = await this.treeRepo.findOne({
      where: { project: { id: project.id }, path: relPath },
    });
    if (!node) {
      node = this.treeRepo.create({ project, path: relPath, readme: null });
      await this.treeRepo.save(node);
    }

    let readme: {
      content: string | null;
      name: string;
      path: string;
    } | null = null;

    if (node.readme) {
      const { relPath, rest } = await pathSafeJoin(
        project.absPath,
        ...node.path.split(sep).concat(node.readme),
      );
      const name = basename(relPath);
      const content = await readFile(rest, "utf8").catch(() => null);
      readme = {
        content,
        name,
        path: rest,
      };
    }
    return { ...tree, readme };
  }

  async setReadme(
    projectUUID: string,
    path: string[],
    readmeFileName: string | null,
  ) {
    const project = await this.projectsSvc.findOne(projectUUID);
    if (project === null) {
      throw new NotFoundException("Project not found");
    }

    const { relPath } = await pathSafeJoin(project.absPath, ...path);
    let node = await this.treeRepo.findOne({
      where: { project: { id: project.id }, path: relPath },
    });

    if (node === null) {
      node = this.treeRepo.create({ project, path: relPath });
    }

    if (
      readmeFileName === null ||
      extname(readmeFileName).toLowerCase() === ".md"
    ) {
      node.readme = readmeFileName;
    }

    return this.treeRepo.save(node);
  }
}
