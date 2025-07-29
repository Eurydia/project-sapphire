import type { IDBPTransaction } from "idb"
import { v4 } from "uuid"
import { getDb, type AppDB } from "./db"
import type { ProjectGroupTableEntity } from "./models/project-group/group-table-entity"

type ServiceTransaction =
  | IDBPTransaction<AppDB, ["project-groups"], "readonly">
  | IDBPTransaction<AppDB, ["project-groups"], "readwrite">
export class ProjectGroupService {
  public static async addByNames(names: string[]) {
    const db = await getDb()
    const tx = db.transaction("project-groups", "readwrite")

    const knownEntries = await this._listByNames(tx, names)
    const knownNames = new Set(
      knownEntries.map(({ name }) => name),
    )

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
    const addedUuids: string[] = []
    for (const result of addResults) {
      if (result.status === "rejected") {
        continue
      }
      addedUuids.push(result.value)
    }
    await tx.done
    return addedUuids.concat(
      knownEntries.map(({ uuid }) => uuid),
    )
  }

  public static async list() {
    const db = await getDb()
    const tx = db.transaction("project-groups")
    const items = this._list(tx)
    await tx.done
    return items
  }

  public static async listByUuids(uuids: string[]) {
    const db = await getDb()
    const tx = db.transaction("project-groups", "readonly")
    const items = await this._listByUuids(tx, uuids)
    await tx.done
    return items
  }

  public static async listByNames(names: string[]) {
    const db = await getDb()
    const tx = db.transaction("project-groups")
    const items = await this._listByNames(tx, names)
    await tx.done
    return items
  }

  private static async _listByNames(
    tx: ServiceTransaction,
    names: string[],
  ) {
    const idx = tx.objectStore("project-groups").index("by-name")
    const promiseResults = await Promise.allSettled(
      names.map((name) => idx.get(IDBKeyRange.only(name))),
    )

    const items: ProjectGroupTableEntity[] = []
    for (const result of promiseResults) {
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

  private static async _list(tx: ServiceTransaction) {
    const idx = tx.objectStore("project-groups").index("by-name")
    return idx.getAll()
  }

  private static async _listByUuids(
    tx: ServiceTransaction,
    uuids: string[],
  ) {
    const store = tx.objectStore("project-groups")
    const promiseResults = await Promise.allSettled(
      uuids.map((uuid) => store.get(uuid)),
    )

    const items: ProjectGroupTableEntity[] = []
    for (const result of promiseResults) {
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
}
