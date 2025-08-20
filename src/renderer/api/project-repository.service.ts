import type { ProjectRepositoryCreateDto } from "#/models/project-repository/dto/create"
import type { ProjectRepositoryUpdateDto } from "#/models/project-repository/dto/update"
import { left, right } from "fp-ts/lib/Either"

export class ProjectRepositoryService {
  private static provider = window["db$project-repository"]

  static async create(dto: ProjectRepositoryCreateDto) {
    return this.provider
      .add(dto)
      .then((res) => right(res))
      .catch((err) => left(err))
  }

  static async update(dto: ProjectRepositoryUpdateDto) {
    return this.provider
      .update(dto)
      .then((res) => right(res))
      .catch((err) => left(err))
  }
}
