import { DataSource } from "typeorm"
import { ProjectTagEntity } from "./entity/project-tag.entity"
import { ProjectTreeEntity } from "./entity/project-tree.entity"
import { ProjectEntity } from "./entity/project.entity"
import { Auto1755378264474 } from "./migrations/1755378264474-Auto"

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: "sapphire-database.sqlite",
  entities: [ProjectEntity, ProjectTagEntity, ProjectTreeEntity],
  subscribers: [],
  synchronize: true,
  migrations: [Auto1755378264474],
})
