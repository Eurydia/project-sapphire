import { Controller, Get, Query } from "@nestjs/common";
import { TechnologiesService } from "./technologies.service";

@Controller("api/technologies")
export class TechnologiesController {
  constructor(private readonly technologiesSvc: TechnologiesService) {}

  @Get()
  async findAll(@Query("uuid") uuid: string) {
    if (uuid) {
      return this.technologiesSvc.findFromProject(uuid);
    }
    return this.technologiesSvc.findAll();
  }
}
