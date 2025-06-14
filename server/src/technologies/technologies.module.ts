import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TechnologiesService } from "./technologies.service";
import { Technology } from "./technology.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Technology])],
  providers: [TechnologiesService],
})
export class TechnologiesModule {}
