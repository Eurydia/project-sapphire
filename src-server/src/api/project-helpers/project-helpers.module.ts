import { Module } from "@nestjs/common";
import { ProjectHelpersService } from "./project-helpers.service";
import { ProjectHelpersController } from "./project-helpers.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Project } from "../projects/project.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  controllers: [ProjectHelpersController],
  providers: [ProjectHelpersService],
})
export class ProjectHelpersModule {}
