import { Injectable, NotFoundException } from "@nestjs/common";
import { projectTreeReadDir } from "src/common/utils/project-tree-read-dir.helper";
import { ProjectsService } from "src/projects/projects.service";

@Injectable()
export class ProjectTreeService {
  constructor(private readonly projectsSvc: ProjectsService) {}

  async readDir(projectUUID: string, path: string[]) {
    const project = await this.projectsSvc.findOne(projectUUID);
    if (project === null) {
      throw new NotFoundException("Project not found");
    }
    return projectTreeReadDir(project, path);
  }
}
