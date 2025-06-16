import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LoggerMiddleware } from "./common/middlerware/logger.middleware";
import { ProjectBlobModule } from "./project-blob/project-blob.module";
import { ProjectTreeModule } from "./project-tree/project-tree.module";
import { ProjectsModule } from "./projects/projects.module";
import { TechnologiesModule } from "./technologies/technologies.module";
import { TopicsModule } from "./topics/topics.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "database/db.sqlite",
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
