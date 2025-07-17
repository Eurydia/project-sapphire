import { DataSource } from "typeorm";
import { Project } from "./models/project.entity";
import { Technology } from "./models/technology.entity";
import { Topic } from "./models/topic.entity";

// let db = join(app.getPath("userData"), "database", "database.sqlite");
// if (!app.isPackaged) {
//   db = join(app.getPath("userData"), "database", "database.dev.sqlite");
// }

export const DATA_SOURCE = new DataSource({
  type: "better-sqlite3",
  database: ":memory:",
  synchronize: true,
  logging: true,
  entities: [Project, Topic, Technology],
  migrations: [],
  subscribers: [],
  logger: "file",
});
