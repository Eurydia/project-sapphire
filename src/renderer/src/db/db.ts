import { openDB, type DBSchema, type IDBPDatabase } from "idb"
import type { ProjectTableEntity } from "./models/project/project-table-entity"
import type { Technology } from "./models/technology/tech-table-entity"
import type { TopicTableEntity } from "./models/topic/topic-table.entity"

interface AppDB extends DBSchema {
  technologies: {
    key: string
    value: Technology
    indexes: { "by-name": string }
  }
  projects: {
    key: string
    value: ProjectTableEntity
    indexes: { "by-name": string; "by-pinned_name": string }
  }
  topics: {
    key: string
    value: TopicTableEntity
    indexes: { "by-name": string }
  }
}

let dbPromise: Promise<IDBPDatabase<AppDB>>

export const getDb = () => {
  if (!dbPromise) {
    dbPromise = openDB<AppDB>(
      import.meta.env.PROD ? "sapphire.db" : "sapphire.dev.db",
      2,
      {
        upgrade: (db, prevVersion, _, tx) => {
          if (prevVersion < 1) {
            const projStore = db.createObjectStore("projects", {
              keyPath: "uuid",
            })
            projStore.createIndex("by-name", "name")

            const techStore = db.createObjectStore(
              "technologies",
              { keyPath: "uuid" },
            )
            techStore.createIndex("by-name", "name", {
              unique: true,
            })

            const topicStore = db.createObjectStore("topics", {
              keyPath: "uuid",
            })
            topicStore.createIndex("by-name", "name", {
              unique: true,
            })
          }
          if (prevVersion < 2) {
            const projStore = tx.objectStore("projects")
            projStore.createIndex("by-pinned_name", [
              "pinned",
              "name",
            ])
          }
        },
      },
    )
  }
  return dbPromise
}
