import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TechnologiesController } from "./technologies.controller";
import { TechnologiesService } from "./technologies.service";
import { Technology } from "./technology.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Technology])],
  providers: [TechnologiesService],
  controllers: [TechnologiesController],
  exports: [TechnologiesService],
})
export class TechnologiesModule {}
