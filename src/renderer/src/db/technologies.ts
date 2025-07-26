import { v4 } from "uuid"
import { getDb } from "./db"
import type { Technology } from "./models/technology/tech-table-entity"

export const listTech = async () => {
  return (await getDb()).getAll("technologies")
}

export const listTechManyByUuid = async (uuids: string[]) => {
  const db = await getDb()
  const tx = db.transaction("technologies", "readonly")
  const store = tx.objectStore("technologies")
  const result = await Promise.allSettled(
    uuids.map((uuid) => store.get(uuid)),
  )
  await tx.done

  const entries: Technology[] = []
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

export const listTechManyByName = async (names: string[]) => {
  const db = await getDb()
  const tx = db.transaction("technologies", "readonly")

  const idx = tx.objectStore("technologies").index("by-name")

  const result = await Promise.allSettled(
    names.map((name) => idx.get(name)),
  )

  await tx.done

  const entries: Technology[] = []
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

export const addTechManyByName = async (names: string[]) => {
  const knownEntries = await listTechManyByName(names)
  const knownNames = new Set(
    knownEntries.map(({ name }) => name),
  )

  const db = await getDb()
  const tx = db.transaction("technologies", "readwrite")
  const store = tx.objectStore("technologies")
  const newEntries: Technology[] = []
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
