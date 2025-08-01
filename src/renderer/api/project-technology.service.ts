import { technologySchema } from "#/models/technology/tech-table-entity"
import { uniq } from "lodash"

export class ProjectTechnologyService {
  private static provider = window["db$technology"]

  static async list() {
    return this.provider
      .list()
      .then((response) =>
        technologySchema.array().parseAsync(response),
      )
  }

  static async listNames() {
    return this.list().then((response) =>
      uniq(response.map(({ name }) => name)),
    )
  }
}
