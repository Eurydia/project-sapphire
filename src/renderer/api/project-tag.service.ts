import type { UpdateProjectTagDto } from "#/models/project-tag/dto/update-project-tag.dto"
import { projectTagSchema } from "#/models/project-tag/project-tag-entity"
import { left, right } from "fp-ts/Either"
import { uniq } from "lodash"

export class ProjectTagService {
  private static provider = window["db$tags"]
  static async list() {
    return this.provider
      .list()
      .then((response) =>
        projectTagSchema.array().parseAsync(response),
      )
  }

  static async listNames() {
    return this.list().then((response) =>
      uniq(response.map(({ name }) => name)),
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
}
