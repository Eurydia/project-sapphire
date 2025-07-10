import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Technology } from "src/api/technologies/technology.entity";
import { Topic } from "src/api/topics/topic.entity";
import { TechnologiesModule } from "../technologies/technologies.module";
import { TopicsModule } from "../topics/topics.module";
import { Project } from "./project.entity";
import { ProjectsController } from "./projects.controller";
import { ProjectsService } from "./projects.service";
import { ProjectsGateway } from "./projects.gateway";
import { NlCredentialModuleModule } from "src/nl-credential-module/nl-credential-module.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Topic, Technology]),
    TopicsModule,
    TechnologiesModule,
    NlCredentialModuleModule,
  ],
  providers: [ProjectsService, ProjectsGateway],
  controllers: [ProjectsController],
  exports: [ProjectsService],
})
export class ProjectsModule {}
