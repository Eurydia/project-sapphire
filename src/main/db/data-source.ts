import { DataSource } from "typeorm"

type Module = Record<string, any>

const entities = Object.values(
  import.meta.glob("./entity/*.entity.ts", {
    eager: true,
  }) as Module,
)
  .flatMap((m) => Object.values(m))
  .filter((v): v is Function => typeof v === "function")

const migrations = Object.values(
  import.meta.glob("./migrations/*-Auto.ts", {
    eager: true,
  }) as Module,
)
  .flatMap((m) => Object.values(m))
  .filter(
    (v): v is Function =>
      typeof v === "function" &&
      typeof v.prototype?.up === "function",
  )

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: "sapphire-database.sqlite",
  entities,
  subscribers: [],
  migrations,
})
