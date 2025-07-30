import type { IDBPTransaction } from "idb"
import { v4 } from "uuid"
import { getDb, type AppDB } from "./db"
import type { TopicTableEntity } from "./models/topic/topic-table.entity"

type ReadWriteTransaction = IDBPTransaction<
  AppDB,
  ["topics"],
  "readwrite"
>
type ReadTransaction =
  | IDBPTransaction<AppDB, ["topics"]>
  | ReadWriteTransaction

export class TopicService {
  public static async list() {
    const db = await getDb()
    const tx = db.transaction("topics")
    const items = this._list(tx)
    await tx.done
    return items
  }

  private static async _list(tx: ReadTransaction) {
    const store = tx.objectStore("topics")
    const items = await store.getAll()
    return items
  }

  public static async listdByNames(names: string[]) {
    const db = await getDb()
    const tx = db.transaction("topics", "readonly")
    const items = await this._listByNames(tx, names)
    await tx.done
    return items
  }

  private static async _listByNames(
    tx: ReadTransaction,
    names: string[],
  ) {
    const idx = tx.objectStore("topics").index("by-name")
    const results = await Promise.allSettled(
      names.map((name) => idx.get(name)),
    )
    const items: TopicTableEntity[] = []
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

  public static async addByNames(names: string[]) {
    const db = await getDb()
    const tx = db.transaction("topics", "readwrite")
    const knownEntries = await this._listByNames(tx, names)
    const unknownNames = await this._filterUnknownNames(
      names,
      knownEntries,
    )
    const newUuids = await this._addByNames(tx, unknownNames)
    await tx.done
    return newUuids.concat(knownEntries.map(({ uuid }) => uuid))
  }

  private static _createFromNames(names: string[]) {
    return names.map(
      (name) =>
        ({
          uuid: v4(),
          name,
          color: "#ff00ff",
        }) satisfies TopicTableEntity,
    )
  }

  private static async _addByNames(
    tx: ReadWriteTransaction,
    names: string[],
  ) {
    const store = tx.objectStore("topics")
    const entries = this._createFromNames(names)
    const results = await Promise.allSettled(
      entries.map((entry) => store.add(entry)),
    )
    const items: string[] = []
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

  private static async _filterUnknownNames(
    names: string[],
    knownEntries: TopicTableEntity[],
  ) {
    const knownNames = new Set(
      knownEntries.map(({ name }) => name),
    )
    return names.filter((name) => !knownNames.has(name))
  }

  public static async listByUuids(uuids: string[]) {
    const db = await getDb()
    const tx = db.transaction("topics")
    const items = await this._listByUuids(tx, uuids)
    await tx.done
    return items
  }

  private static async _listByUuids(
    tx: ReadTransaction,
    uuids: string[],
  ) {
    const store = tx.objectStore("topics")
    const results = await Promise.allSettled(
      uuids.map((uuid) => store.get(uuid)),
    )
    const items: TopicTableEntity[] = []
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
}
