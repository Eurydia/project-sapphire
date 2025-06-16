import { Controller, Get, Param } from "@nestjs/common";
import { ProjectTreeService } from "./project-tree.service";

@Controller("/projects/:projectUUID/tree")
export class ProjectTreeController {
  constructor(private readonly projectTreeSvc: ProjectTreeService) {}

  @Get()
  readDirRoot(@Param("projectUUID") projectUUID: string) {
    console.debug("index");
    return this.projectTreeSvc.readDir(projectUUID, []);
  }

  @Get("*path")
  readDir(
    @Param("projectUUID") projectUUID: string,
    @Param("path") path: string[],
  ) {
    return this.projectTreeSvc.readDir(projectUUID, path);
  }
}
