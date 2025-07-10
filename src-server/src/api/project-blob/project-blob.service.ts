import { Injectable, NotFoundException } from "@nestjs/common";
import { ProjectsService } from "src/api/projects/projects.service";
import { projectBlobReadFile } from "src/common/utils/project-blob-read-file.helper";

@Injectable()
export class ProjectBlobService {
  constructor(private readonly projectsService: ProjectsService) {}

  async readFile(projectUUID: string, path: string[]) {
    const project = await this.projectsService.getOne(projectUUID);
    if (project === null) {
      throw new NotFoundException("Project not found");
    }

    return projectBlobReadFile(project, path);
  }
}
