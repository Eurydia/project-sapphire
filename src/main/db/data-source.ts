import { app } from "electron"
import { DataSource } from "typeorm"
import { entities } from "./entities"
import { migrations } from "./migrations"

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: app.isPackaged
    ? `sapphire-database.${app.getVersion()}.sqlite`
    : `sapphire-database.sqlite`,
  entities,
  subscribers: [],
  migrations,
})
