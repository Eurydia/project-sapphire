import { In } from "typeorm"
import { z } from "zod/v4"
import { registerIpcMainServices } from "../../services/core"
import { AppDataSource } from "../data-source"
import { GroupEntity } from "../entity/Group"

const repo = AppDataSource.getRepository(GroupEntity)
const list = async () => {
  return repo.find({ order: { name: "asc" } })
}

const listByUuids = async (arg: unknown) => {
  const uuids = z.uuidv4().array().parse(arg)
  return repo.find({
    order: { name: "ASC" },
    where: { uuid: In(uuids) },
  })
}

const listByNames = async (arg: unknown) => {
  const names = z
    .string()
    .trim()
    .normalize()
    .nonempty()
    .array()
    .parse(arg)
  return repo.find({
    order: { name: "ASC" },
    where: { name: In(names) },
  })
}

registerIpcMainServices("db$group", {
  list,
  listByNames,
  listByUuids,
})
