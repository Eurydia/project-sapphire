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
import { ProjectsService } from "./projects.service";
import { UpdateProjectDto } from "./dto/update-project.dto";

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

  @Put(":uuid")
  update(@Param("uuid") uuid: string, @Body() dto: UpdateProjectDto) {
    return this.projectsSvc.update(uuid, dto);
  }

  @Post(":uuid/pin")
  pin(@Param("uuid") uuid: string) {
    return this.projectsSvc.pin(uuid);
  }

  @Post(":uuid/unpin")
  unpin(@Param("uuid") uuid: string) {
    return this.projectsSvc.unpin(uuid);
  }

  @Delete(":uuid")
  remove(@Param("uuid") uuid: string) {
    return this.projectsSvc.delete(uuid);
  }
}
