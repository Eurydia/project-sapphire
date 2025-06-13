import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { CreateProjectDto } from "./dto/create-project.dto";
import { Project } from "./projects.entity";
import { ProjectsService } from "./projects.service";

@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsSvc: ProjectsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() data: CreateProjectDto) {
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
