import "reflect-metadata"
import { DataSource } from "typeorm"

export default new DataSource({
  type: "better-sqlite3",
  database: "sapphire-database.sqlite",
  synchronize: false,
  logging: false,
  entities: ["src/main/db/entity/**/*.{ts,js}"],
  migrations: ["src/main/db/migrations/**/*.{ts,js}"],
})
