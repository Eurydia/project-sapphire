import { app } from "electron";
import { join } from "node:path";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Project } from "./models/project.entity";
import { Topic } from "./models/topic.entity";
import { Technology } from "./models/technology.entity";

export const DATA_SOURCE = new DataSource({
  type: "sqlite",
  database: join(app.getPath("userData"), "database", "database.dev.sqlite"),
  synchronize: true,
  logging: false,
  entities: [Project, Topic, Technology],
  migrations: [],
  subscribers: [],
});
