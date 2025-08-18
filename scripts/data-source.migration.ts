import "reflect-metadata"
import { DataSource } from "typeorm"

export default new DataSource({
  type: "better-sqlite3",
  database: "sapphire-database.sqlite",
  synchronize: false,
  logging: false,
  entities: ["src/main/db/entity/**/*.entity.ts"],
  migrations: ["src/main/db/migrations/**/*-Auto.ts"],
})
