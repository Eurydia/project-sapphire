import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LoggerMiddleware } from "./common/middlerware/logger.middleware";
import { ProjectBlobModule } from "./api/project-blob/project-blob.module";
import { ProjectTreeModule } from "./api/project-tree/project-tree.module";
import { ProjectsModule } from "./api/projects/projects.module";
import { TechnologiesModule } from "./api/technologies/technologies.module";
import { TopicsModule } from "./api/topics/topics.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "..", "src-client", "dist"),
      serveRoot: "/",
      exclude: ["/api/*"],
    }),
    ProjectsModule,
    TechnologiesModule,
    TopicsModule,
    ProjectBlobModule,
    ProjectTreeModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
