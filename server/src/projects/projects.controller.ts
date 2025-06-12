import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { Project } from "./projects.entity";
import { ProjectsService } from "./projects.service";

@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsSvc: ProjectsService) {}

  @Post()
  create(@Body() data: Partial<Project>) {
    return this.projectsSvc.create(data);
  }

  @Get()
  findAll() {
    return this.projectsSvc.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.projectsSvc.findOne(+id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() data: Partial<Project>) {
    return this.projectsSvc.update(+id, data);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.projectsSvc.remove(+id);
  }
}
