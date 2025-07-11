import { MessageBody, SubscribeMessage, WsResponse } from "@nestjs/websockets";
import { Project } from "./project.entity";
import { ProjectsService } from "./projects.service";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { UpdateResult } from "typeorm";

export class ProjectsGateway {
  constructor(private readonly projectsSvc: ProjectsService) {}

  @SubscribeMessage("getProjects")
  async handleGetProjects(): Promise<WsResponse<Project[]>> {
    return {
      event: "getProjectsResponse",
      data: await this.projectsSvc.getAll(),
    };
  }

  @SubscribeMessage("getProject")
  async handleGetProject(
    @MessageBody("uuid") uuid: string,
  ): Promise<WsResponse<Project | null>> {
    return {
      event: "getProjectResponse",
      data: await this.projectsSvc.getOne(uuid),
    };
  }

  @SubscribeMessage("updateProject")
  async handleUpdateProject(
    @MessageBody("uuid") uuid: string,
    @MessageBody("dto") dto: UpdateProjectDto,
  ): Promise<WsResponse<Project>> {
    return {
      event: "updateProjectResponse",
      data: await this.projectsSvc.update(uuid, dto),
    };
  }

  @SubscribeMessage("pinProject")
  async handlePinProject(
    @MessageBody("uuid") uuid: string,
  ): Promise<WsResponse<Project>> {
    return {
      event: "pinProjectResponse",
      data: await this.projectsSvc.pin(uuid),
    };
  }

  @SubscribeMessage("unpinProject")
  async handleUnpinProject(
    @MessageBody("uuid") uuid: string,
  ): Promise<WsResponse<Project>> {
    return {
      event: "unpinProjectResponse",
      data: await this.projectsSvc.unpin(uuid),
    };
  }

  @SubscribeMessage("deleteProject")
  async handleDeleteProject(
    @MessageBody("uuid") uuid: string,
  ): Promise<WsResponse<UpdateResult>> {
    return {
      event: "deleteProjectResponse",
      data: await this.projectsSvc.delete(uuid),
    };
  }
}
