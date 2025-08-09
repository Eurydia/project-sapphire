import type { CreateProjectDto } from "#/models/project/dto/create-project.dto"
import {
  projectPaginationQuerySchema,
  projectPaginationResultSchema,
  type ProjectPaginationQuery,
} from "#/models/project/dto/pagination-project.dto"
import type { UpsertProjectDto } from "#/models/project/dto/upsert-project.dto"
import { projectSchema } from "#/models/project/project"
import { left, right } from "fp-ts/lib/Either"
import z from "zod"

export class ProjectService {
  private static provider = window["db$project"]
  static async list(query: ProjectPaginationQuery) {
    console.debug(query)
    return this.provider
      .list(projectPaginationQuerySchema.parse(query))
      .then((resp) =>
        projectPaginationResultSchema.parseAsync(resp),
      )
  }

  static async listNames() {
    return this.provider
      .listNames()
      .then((resp) => z.string().array().parseAsync(resp))
  }

  static async findByUuid(uuid: string) {
    return this.provider
      .findByUuid(uuid)
      .then((response) =>
        projectSchema.nullable().parseAsync(response),
      )
  }
  static async upsert(dto: UpsertProjectDto) {
    return this.provider.upsertProject(dto)
  }
  static async create(dto: CreateProjectDto) {
    return this.provider.createProject(dto)
  }
  static async unpin(uuid: string) {
    return this.provider
      .unpin(uuid)
      .then((resp) => right<Error, unknown>(resp))
      .catch((err) => left<Error, unknown>(err))
  }
  static async pin(uuid: string) {
    return this.provider
      .pin(uuid)
      .then((resp) => right<Error, unknown>(resp))
      .catch((err) => left<Error, unknown>(err))
  }
}
