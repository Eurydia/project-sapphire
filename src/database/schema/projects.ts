import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";
import { sqliteTable } from "drizzle-orm/sqlite-core";
import { topicsTable } from "./topics";

export const projectsTable = sqliteTable("projects", {
  id: t.integer().primaryKey(),
  name: t.text().notNull(),
  absPath: t.text().notNull(),
  description: t.text(),
});

export const projectsRelations = relations(projectsTable, ({ many }) => ({
  projectsTopicsTableSchema: many(projectsTopicsTable),
}));

export const topicsRelations = relations(topicsTable, ({ many }) => ({
  projectsTopicsTableSchema: many(projectsTopicsTable),
}));

export const projectsTopicsTable = sqliteTable(
  "projects_topics",
  {
    projectId: t
      .integer()
      .notNull()
      .references(() => projectsTable.id, { onDelete: "cascade" }),
    topicId: t
      .integer()
      .notNull()
      .references(() => topicsTable.id, { onDelete: "cascade" }),
  },
  (table) => [t.primaryKey({ columns: [table.projectId, table.topicId] })],
);
export const projectsTopicsRelations = relations(
  projectsTopicsTable,
  ({ one }) => ({
    project: one(projectsTable, {
      fields: [projectsTopicsTable.projectId],
      references: [projectsTable.id],
    }),
    topic: one(topicsTable, {
      fields: [projectsTopicsTable.topicId],
      references: [topicsTable.id],
    }),
  }),
);
