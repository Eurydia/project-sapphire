import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { CreateProjectDto } from "./dto/create-project.dto";
import { Project } from "./project.entity";
import { ProjectsService } from "./projects.service";

@UseInterceptors(ClassSerializerInterceptor)
@Controller("api/projects")
export class ProjectsController {
  constructor(private readonly projectsSvc: ProjectsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() dto: CreateProjectDto) {
    return this.projectsSvc.create(dto);
  }

  @Get()
  findAll() {
    return this.projectsSvc.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.projectsSvc.findOne(id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() data: Partial<Project>) {
    return this.projectsSvc.update(id, data);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.projectsSvc.remove(id);
  }
}
