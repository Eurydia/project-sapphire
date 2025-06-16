import { Module } from "@nestjs/common";
import { ProjectsModule } from "src/projects/projects.module";
import { ProjectBlobController } from "./project-blob.controller";
import { ProjectBlobService } from "./project-blob.service";

@Module({
  controllers: [ProjectBlobController],
  providers: [ProjectBlobService],
  imports: [ProjectsModule],
})
export class ProjectBlobModule {}
