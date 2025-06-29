import { Controller, Get, Param } from "@nestjs/common";
import { ProjectBlobService } from "./project-blob.service";

@Controller("projects/:projectUUID/blob")
export class ProjectBlobController {
  constructor(private readonly projectBlobService: ProjectBlobService) {}

  @Get("*path")
  async getFile(
    @Param("projectUUID") projectUUID: string,
    @Param("path") path: string[],
  ) {
    return this.projectBlobService.readFile(projectUUID, path);
  }
}
