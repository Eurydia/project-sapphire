import type { CreateProjectDto } from "#/models/project/dto/create-project.dto"
import {
  projectQuerySchema,
  type ProjectQuery,
} from "#/models/project/dto/query-project.dto"
import type { UpsertProjectDto } from "#/models/project/dto/upsert-project.dto"
import { projectSchema } from "#/models/project/project"
import { left, right } from "fp-ts/lib/Either"
import { uniq } from "lodash"

export class ProjectService {
  private static provider = window["db$project"]
  static async list(query: ProjectQuery) {
    return this.provider
      .list(projectQuerySchema.parse(query))
      .then((result) => projectSchema.array().parseAsync(result))
  }

  static async listNames() {
    return this.list(projectQuerySchema.parse({})).then(
      (result) => uniq(result.map(({ name }) => name)),
    )
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
