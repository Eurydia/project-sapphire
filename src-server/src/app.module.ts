import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProjectBlobModule } from "./api/project-blob/project-blob.module";
import { ProjectTreeModule } from "./api/project-tree/project-tree.module";
import { ProjectsModule } from "./api/projects/projects.module";
import { TechnologiesModule } from "./api/technologies/technologies.module";
import { TopicsModule } from "./api/topics/topics.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LoggerMiddleware } from "./common/middlerware/logger.middleware";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "better-sqlite3",
      database: "./database/db.sqlite",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),
    ProjectsModule,
    TechnologiesModule,
    TopicsModule,
    ProjectBlobModule,
    ProjectTreeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
