import { appConfigDir, join } from "@tauri-apps/api/path";
import { revealItemInDir } from "@tauri-apps/plugin-opener";
import Database from "@tauri-apps/plugin-sql";
import { drizzle } from "drizzle-orm/sqlite-proxy";

const getDB = async () => {
  const name = import.meta.env.DEV ? "db.dev.sqlite" : "db.sqlite";
  const path = await join("database", name);
  await revealItemInDir(await join(await appConfigDir(), path));
  return Database.load(`sqlite:${name}`);
};

await getDB();

// if (
//   !(await exists(await join("database", name), {
//     baseDir: BaseDirectory.AppLocalData,
//   }))
// ) {
//   await mkdir("database", { baseDir: BaseDirectory.AppLocalData });
//   await create(await join("database", name), {
//     baseDir: BaseDirectory.AppLocalData,
//   });
// } else {
// }
// await revealItemInDir(path);

export const db = drizzle(async (sql, params, method) => {
  const sqlite = await getDB();
  const rows =
    method === "all"
      ? await sqlite.select(sql, params)
      : await sqlite.execute(sql, params);
  await sqlite.close();
  return { rows: method === "all" ? [] : [] };
});
