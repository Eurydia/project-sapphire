import {
  projectTagPaginationResultDtoSchema,
  type ProjectTagPaginationQueryDto,
} from "#/models/project-tag/dto/pagination-project-tag.dto"
import type { UpdateProjectTagDto } from "#/models/project-tag/dto/update-project-tag.dto"
import { projectTagSchema } from "#/models/project-tag/project-tag-entity"
import { left, right } from "fp-ts/Either"
import { z } from "zod/v4"

export class ProjectTagService {
  private static provider = window["db$tags"]
  static async list(query: ProjectTagPaginationQueryDto) {
    return this.provider
      .list(query)
      .then((resp) =>
        projectTagPaginationResultDtoSchema.parseAsync(resp),
      )
  }

  static async listNames() {
    return this.provider
      .listNames()
      .then((resp) =>
        z
          .string()
          .trim()
          .nonempty()
          .normalize()
          .array()
          .parseAsync(resp),
      )
  }
  static async findByUUID(uuid: string) {
    return this.provider
      .findByUUID(uuid)
      .then((response) =>
        projectTagSchema.nullable().parseAsync(response),
      )
  }

  static async update(dto: UpdateProjectTagDto) {
    return this.provider
      .update(dto)
      .then((response) => right<Error, unknown>(response))
      .catch((err) => left<Error, unknown>(err))
  }

  static async pin(uuid: string) {
    return this.provider
      .pin(uuid)
      .then((resp) => right<Error, unknown>(resp))
      .catch((err) => left<Error, unknown>(err))
  }

  static async unpin(uuid: string) {
    return this.provider
      .unpin(uuid)
      .then((resp) => right<Error, unknown>(resp))
      .catch((err) => left<Error, unknown>(err))
  }
}
