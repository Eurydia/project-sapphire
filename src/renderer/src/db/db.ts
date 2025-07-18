import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Technology } from './models/technology/technology'
import type { Project } from './models/project/project'
import type { Topic } from './models/topic/topic'

interface AppDB extends DBSchema {
  technologies: {
    key: string
    value: Technology
    indexes: { 'by-name': string }
  }
  projects: {
    key: string
    value: Project
    indexes: { 'by-name': string }
  }
  topics: {
    key: string
    value: Topic
    indexes: { 'by-name': string }
  }
}

let dbPromise: Promise<IDBPDatabase<AppDB>>

export const getDb = () => {
  if (!dbPromise) {
    dbPromise = openDB<AppDB>(import.meta.env.PROD ? 'sapphire.db' : 'sapphire.dev.db', 1, {
      upgrade: (db) => {
        const projStore = db.createObjectStore('projects', { keyPath: 'uuid' })
        projStore.createIndex('by-name', 'name')

        const techStore = db.createObjectStore('technologies', { keyPath: 'uuid' })
        techStore.createIndex('by-name', 'name', { unique: true })

        const topicStore = db.createObjectStore('topics', { keyPath: 'uuid' })
        topicStore.createIndex('by-name', 'name', { unique: true })
      }
    })
  }
  return dbPromise
}
