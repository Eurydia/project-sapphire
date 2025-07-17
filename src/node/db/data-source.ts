import { app } from "electron";
import { join } from "node:path";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Project } from "./models/project.entity";
import { Technology } from "./models/technology.entity";
import { Topic } from "./models/topic.entity";

let db = join(
  app.getPath("appData"),
  "Sapphire",
  "database",
  "database.sqlite"
);
if (import.meta.env.DEV) {
  db = join(
    app.getPath("appData"),
    "Sapphire",
    "database",
    "database.dev.sqlite"
  );
}
export const DATA_SOURCE = new DataSource({
  type: "better-sqlite3",
  database: db,
  synchronize: true,
  logging: true,
  entities: [Project, Topic, Technology],
  migrations: [],
  subscribers: [],
  logger: "file",
});
