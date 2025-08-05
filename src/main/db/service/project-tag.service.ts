import { ProjectTag } from "#/models/project-tag/project-tag-entity"
import { In } from "typeorm"
import { z } from "zod/v4"
import { registerIpcMainServices } from "../../services/core"
import { AppDataSource } from "../data-source"
import { ProjectTagEntity } from "../entity/project-tag.entity"

const repo = AppDataSource.getRepository(ProjectTagEntity)
const list = async () => {
  return repo.find({
    order: { name: "asc" },
    relations: {
      projects: true,
    },
  })
}

const listByUuids = async (arg: unknown) => {
  const uuids = z.uuidv4().array().parse(arg)
  return repo.find({
    order: { name: "ASC" },
    where: { uuid: In(uuids) },
    relations: {
      projects: true,
    },
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
    relations: {
      projects: true,
    },
  })
}
const findByUUID = async (arg: unknown) => {
  const uuid = z.uuidv4().parse(arg)
  return repo.findOne({
    where: { uuid },
    relations: { projects: true },
  }) satisfies Promise<ProjectTag | null>
}

registerIpcMainServices("db$tags", {
  list,
  listByNames,
  listByUuids,
  findByUUID,
})
