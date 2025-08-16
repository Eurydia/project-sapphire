import { DataSource } from "typeorm"
import { ProjectTagEntity } from "./entity/project-tag.entity"
import { ProjectTreeEntity } from "./entity/project-tree.entity"
import { ProjectEntity } from "./entity/project.entity"

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: "sapphire-database.sqlite",
  entities: [ProjectEntity, ProjectTagEntity, ProjectTreeEntity],
  subscribers: [],
  synchronize: true,
})
