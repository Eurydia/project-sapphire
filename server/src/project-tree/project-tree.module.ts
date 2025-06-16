import { Module } from "@nestjs/common";
import { ProjectsModule } from "src/projects/projects.module";
import { ProjectTreeController } from "./project-tree.controller";
import { ProjectTreeService } from "./project-tree.service";

@Module({
  controllers: [ProjectTreeController],
  providers: [ProjectTreeService],
  imports: [ProjectsModule],
})
export class ProjectTreeModule {}
