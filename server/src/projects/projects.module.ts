import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Technology } from "src/technologies/technology.entity";
import { Topic } from "src/topics/topic.entity";
import { Project } from "./project.entity";
import { ProjectsController } from "./projects.controller";
import { ProjectsService } from "./projects.service";

@Module({
  imports: [TypeOrmModule.forFeature([Project, Topic, Technology])],
  providers: [ProjectsService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
