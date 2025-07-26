import { v4 } from "uuid"
import { getDb } from "./db"
import type { ProjectGroupTableEntity } from "./models/project-group/group-table-entity"

export const listProjectGroups = async () => {
  const db = await getDb()
  const tx = db.transaction("project-groups", "readonly")
  const idx = tx.objectStore("project-groups").index("by-name")
  const items = await idx.getAll()
  await tx.done
  return items
}

export const listProjectGroupManyByUuid = async (
  uuids: string[],
) => {
  const db = await getDb()
  const tx = db.transaction("project-groups", "readonly")
  const store = tx.objectStore("project-groups")
  const results = await Promise.allSettled(
    uuids.map((uuid) => store.get(uuid)),
  )
  await tx.done

  const items: ProjectGroupTableEntity[] = []
  for (const result of results) {
    if (result.status === "rejected") {
      continue
    }
    if (result.value === undefined) {
      continue
    }
    items.push(result.value)
  }
  return items
}

export const listProjectGroupManyByName = async (
  uuids: string[],
) => {
  const db = await getDb()
  const tx = db.transaction("project-groups")
  const store = tx.objectStore("project-groups")
  const items: ProjectGroupTableEntity[] = []
  for (const uuid of uuids) {
    const item = await store.get(uuid)
    if (item !== undefined) {
      items.push(item)
    }
  }
  await tx.done
  return items
}

export const addProjectGroupManyByName = async (
  names: string[],
) => {
  const knownEntries = await listProjectGroupManyByName(names)
  const knownNames = new Set(
    knownEntries.map(({ name }) => name),
  )

  const db = await getDb()
  const tx = db.transaction("project-groups", "readwrite")
  const store = tx.objectStore("project-groups")
  const newEntries: ProjectGroupTableEntity[] = []
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
