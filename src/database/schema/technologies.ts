import * as t from "drizzle-orm/sqlite-core";
import { sqliteTable } from "drizzle-orm/sqlite-core";

export const technologiesTable = sqliteTable("technologies", {
  id: t.integer().primaryKey(),
  name: t.text().notNull(),
  color: t.text().notNull(),
});
