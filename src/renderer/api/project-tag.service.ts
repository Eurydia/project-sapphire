import { projectTagSchema } from "#/models/project-tag/project-tag-entity"
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
}
