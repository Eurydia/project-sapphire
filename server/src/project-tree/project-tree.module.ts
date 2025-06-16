import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProjectsModule } from "src/projects/projects.module";
import { ProjectTree } from "./entities/project-tree.entity";
import { ProjectTreeController } from "./project-tree.controller";
import { ProjectTreeService } from "./project-tree.service";

@Module({
  controllers: [ProjectTreeController],
  providers: [ProjectTreeService],
  imports: [TypeOrmModule.forFeature([ProjectTree]), ProjectsModule],
})
export class ProjectTreeModule {}
