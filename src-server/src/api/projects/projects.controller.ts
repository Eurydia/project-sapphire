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

  @Get(":uuid")
  findOne(@Param("uuid") uuid: string) {
    return this.projectsSvc.findOne(uuid);
  }

  @Get(":uuid/metadata")
  findMetadata(@Param("uuid") uuid: string) {
    return this.projectsSvc.getMetadata(uuid);
  }

  @Put(":uuid")
  update(@Param("uuid") uuid: string, @Body() data: Partial<Project>) {
    return this.projectsSvc.update(uuid, data);
  }

  @Delete(":uuid")
  remove(@Param("uuid") uuid: string) {
    return this.projectsSvc.delete(uuid);
  }
}
