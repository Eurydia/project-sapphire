import { topicSchema } from "#/models/topic/topic-table.entity"
import { uniq } from "lodash"

export class ProjectTopicService {
  public static async list() {
    return window["db$topic"]
      .list()
      .then((response) =>
        topicSchema.array().parseAsync(response),
      )
  }

  public static async listNames() {
    return this.list().then((response) =>
      uniq(response.map(({ name }) => name)),
    )
  }
}
