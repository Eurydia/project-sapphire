import { Controller, Get, Param, Query } from "@nestjs/common";
import { ProjectHelpersService } from "./project-helpers.service";

@Controller("api/projects")
export class ProjectHelpersController {
  constructor(private readonly projectHelpersService: ProjectHelpersService) {}

  @Get()
  async exists(@Query("exists") uuid?: string) {
    if (!uuid) {
      return false;
    }
    return this.projectHelpersService.exists(uuid);
  }

  @Get(":uuid/metadata")
  async getMetadata(@Param("uuid") uuid: string) {
    return this.projectHelpersService.getMetadata(uuid);
  }
}
