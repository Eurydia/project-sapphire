import type { ProjectWorkspaceCreateDto } from "#/models/project-workspace/dto/create"
import type { ProjectWorkspaceUpdateDto } from "#/models/project-workspace/dto/update"
import { left, right } from "fp-ts/lib/Either"

export class ProjectWorkspaceService {
  private static provider = window["db$project-workspace"]

  static async create(dto: ProjectWorkspaceCreateDto) {
    return this.provider
      .add(dto)
      .then((res) => right(res))
      .catch((err) => left(err))
  }

  static async update(dto: ProjectWorkspaceUpdateDto) {
    return this.provider
      .update(dto)
      .then((res) => right(res))
      .catch((err) => left(err))
  }

  static async deleteByUUID(uuid: string) {
    return this.provider
      .deleteByUUID(uuid)
      .then((res) => right(res))
      .catch((err) => left(err))
  }
}
