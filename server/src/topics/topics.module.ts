import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Topic } from "./topic.entity";
import { TopicsService } from "./topics.service";

@Module({
  imports: [TypeOrmModule.forFeature([Topic])],
  providers: [TopicsService],
})
export class TopicsModule {}
