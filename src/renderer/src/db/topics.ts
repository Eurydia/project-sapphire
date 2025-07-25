import { v4 } from "uuid"
import { getDb } from "./db"
import type { TopicTableEntity } from "./models/topic/topic-table.entity"

export const listTopic = async () => {
  return (await getDb()).getAll("topics")
}

export const listManyTopicsByName = async (names: string[]) => {
  const db = await getDb()
  const tx = db.transaction("topics", "readonly")
  const idx = tx.objectStore("topics").index("by-name")
  const result = await Promise.allSettled(
    names.map((name) => idx.get(name)),
  )
  await tx.done

  const entries: TopicTableEntity[] = []
  for (const entry of result) {
    if (entry.status === "rejected") {
      continue
    }
    if (entry.value === undefined) {
      continue
    }
    entries.push(entry.value)
  }
  return entries
}

export const addTopicManyByName = async (names: string[]) => {
  const knownEntries = await listManyTopicsByName(names)
  const knownNames = new Set(
    knownEntries.map(({ name }) => name),
  )

  const db = await getDb()
  const tx = db.transaction("topics", "readwrite")
  const store = tx.objectStore("topics")
  const newEntries: TopicTableEntity[] = []
  for (const name of names) {
    if (knownNames.has(name)) {
      continue
    }
    newEntries.push({ uuid: v4(), color: "#3333333", name })
  }

  const addResults = await Promise.allSettled(
    newEntries.map((entry) => store.add(entry)),
  )
  await tx.done
  const addedUuids: string[] = []
  for (const result of addResults) {
    if (result.status === "rejected") {
      continue
    }
    addedUuids.push(result.value)
  }

  return addedUuids.concat(knownEntries.map(({ uuid }) => uuid))
}

export const listTopicManyByUuid = async (uuids: string[]) => {
  const db = await getDb()
  const tx = db.transaction("topics", "readonly")
  const store = tx.objectStore("topics")
  const result = await Promise.allSettled(
    uuids.map((uuid) => store.get(uuid)),
  )
  await tx.done
  const entries: TopicTableEntity[] = []
  for (const entry of result) {
    if (entry.status === "rejected") {
      continue
    }
    if (entry.value === undefined) {
      continue
    }
    entries.push(entry.value)
  }
  return entries
}
