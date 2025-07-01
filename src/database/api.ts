import { appLocalDataDir, BaseDirectory, join } from "@tauri-apps/api/path";
import { create, exists, mkdir } from "@tauri-apps/plugin-fs";
import { revealItemInDir } from "@tauri-apps/plugin-opener";
import Database from "@tauri-apps/plugin-sql";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { drizzle } from "drizzle-orm/sqlite-proxy";

const getDB = async () => {
  const base = await appLocalDataDir();
  const name = import.meta.env.DEV ? "db.dev.sqlite" : "db.sqlite";
  const path = await join(base, "database", name);
  return Database.load(`sqlite://${path}`);
};

const base = await appLocalDataDir();
const name = import.meta.env.DEV ? "db.dev.sqlite" : "db.sqlite";
const path = await join(base, "database", name);
if (
  !(await exists(await join("database", name), {
    baseDir: BaseDirectory.AppLocalData,
  }))
) {
  await mkdir("database", { baseDir: BaseDirectory.AppLocalData });
  await create(await join("database", name), {
    baseDir: BaseDirectory.AppLocalData,
  });
} else {
  await revealItemInDir(path);
}

export const db = drizzle(async (sql, params, method) => {
  const sqlite = await getDB();
  const rows =
    method === "all"
      ? await sqlite.select(sql, params)
      : await sqlite.execute(sql, params);
  await sqlite.close();
  return { rows: method === "all" ? [] : [] };
});

export const users = sqliteTable("users", {
  id: integer("id", { mode: "number" }).primaryKey(),
  name: text("name"),
});

await db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    name  TEXT    NOT NULL,
    email TEXT    NOT NULL
  );
`);
