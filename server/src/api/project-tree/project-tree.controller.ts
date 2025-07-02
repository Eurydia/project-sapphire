import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import { ProjectTreeService } from "./project-tree.service";

@Controller("/projects/:projectUUID/tree")
export class ProjectTreeController {
  constructor(private readonly projectTreeSvc: ProjectTreeService) {}

  @Get("{/*path}")
  readDir(
    @Param("projectUUID") projectUUID: string,
    @Param("path") path: string[] | undefined,
  ) {
    return this.projectTreeSvc.readDir(projectUUID, path ?? []);
  }

  @Patch("{/*path}")
  updateReadme(
    @Param("projectUUID") projectUUID: string,
    @Param("path") path: string[] | undefined,
    @Body("readme") readme: string | null,
  ) {
    return this.projectTreeSvc.setReadme(projectUUID, path ?? [], readme);
  }
}
