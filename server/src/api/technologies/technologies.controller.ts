import { Controller, Get } from "@nestjs/common";
import { TechnologiesService } from "./technologies.service";

@Controller("api/technologies")
export class TechnologiesController {
  constructor(private readonly technologiesSvc: TechnologiesService) {}

  @Get()
  async findAll() {
    return this.technologiesSvc.findAll();
  }
}
