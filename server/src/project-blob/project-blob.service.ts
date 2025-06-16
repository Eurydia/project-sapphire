import { Injectable, NotFoundException } from "@nestjs/common";
import { projectBlobReadFile } from "src/common/utils/project-blob-read-file.helper";
import { ProjectsService } from "src/projects/projects.service";

@Injectable()
export class ProjectBlobService {
  constructor(private readonly projectsService: ProjectsService) {}

  async readFile(projectUUID: string, path: string[]) {
    const project = await this.projectsService.findOne(projectUUID);
    if (project === null) {
      throw new NotFoundException("Project not found");
    }

    return projectBlobReadFile(project, path);
  }
}
