import { Controller, Get } from "@nestjs/common";
import { TopicsService } from "./topics.service";

@Controller("api/topics")
export class TopicsController {
  constructor(private readonly topicsSvc: TopicsService) {}

  @Get()
  findAll() {
    return this.topicsSvc.findAll();
  }
}
