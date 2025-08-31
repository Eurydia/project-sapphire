import type { CreateProjectDto } from "#/models/project/dto/create-project.dto"
import type { UpsertProjectDto } from "#/models/project/dto/upsert-project.dto"
import { ProjectSchema } from "#/models/project/project"
import { left, right } from "fp-ts/lib/Either"
import z from "zod"

export class ProjectService {
  private static provider = window["db$project"]

  static async list(query: string[]) {
    return this.provider
      .list(query)
      .then((resp) => ProjectSchema.array().parseAsync(resp))
  }

  static async listNames() {
    return this.provider
      .listNames()
      .then((resp) => z.string().array().parseAsync(resp))
  }

  static async findByUuid(uuid: string) {
    return this.provider
      .findByUuid(uuid)
      .then((resp) => ProjectSchema.parseAsync(resp))
      .then((resp) => right(resp))
      .catch((err) => left(err))
  }
  static async upsert(dto: UpsertProjectDto) {
    return this.provider.upsert(dto)
  }
  static async create(dto: CreateProjectDto) {
    return this.provider
      .create(dto)
      .then((resp) => ProjectSchema.parseAsync(resp))
      .then((resp) => right(resp))
      .catch((err) => left(err))
  }
  static async createFromPaths(paths: string[]) {
    return this.provider.createFromPaths(paths)
  }

  static async unpin(uuid: string) {
    return this.provider
      .unpin(uuid)
      .then((resp) => right(resp))
      .catch((err) => left(err))
  }
  static async pin(uuid: string) {
    return this.provider
      .pin(uuid)
      .then((resp) => right(resp))
      .catch((err) => left(err))
  }

  static async deleteByUUID(uuid: string) {
    return this.provider
      .deleteByUUID(uuid)
      .then((resp) => right(resp))
      .catch((err) => left(err))
  }
}
