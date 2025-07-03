import { Controller, Get, Query } from "@nestjs/common";
import { TopicsService } from "./topics.service";

@Controller("api/topics")
export class TopicsController {
  constructor(private readonly topicsSvc: TopicsService) {}

  @Get()
  findAll(@Query("uuid") uuid: string) {
    if (uuid) {
      return this.topicsSvc.findFromProject(uuid);
    }
    return this.topicsSvc.findAll();
  }
}
