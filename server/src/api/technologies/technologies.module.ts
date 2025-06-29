import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TechnologiesService } from "./technologies.service";
import { Technology } from "./technology.entity";
import { TechnologiesController } from './technologies.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Technology])],
  providers: [TechnologiesService],
  controllers: [TechnologiesController],
})
export class TechnologiesModule {}
