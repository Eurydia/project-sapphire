import { DataSource } from "typeorm"
import { GroupEntity } from "./entity/Group"
import { ProjectEntity } from "./entity/project/project.entity"
import { TechnologyEntity } from "./entity/Technology"
import { TopicEntity } from "./entity/Topic"

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: "sapphire-database.sqlite",
  synchronize: true,
  logging: true,
  entities: [
    ProjectEntity,
    GroupEntity,
    TechnologyEntity,
    TopicEntity,
  ],
  migrations: [],
  subscribers: [],
})
