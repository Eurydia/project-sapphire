import { projectTagSchema } from "#/models/project-tag/project-tag-entity"
import { uniq } from "lodash"

export class ProjectTagService {
  static async list() {
    return window["db$tags"]
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
}
