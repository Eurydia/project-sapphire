import { projectTreeSchema } from "#/models/project-tree/project-tree"

export class ProjectTreeService {
  private static provider = window["db$project-tree"]
  static async getRootTree(projectUuid: string) {
    return this.provider
      .getRootTree(projectUuid)
      .then((response) =>
        projectTreeSchema.nullable().parseAsync(response),
      )
  }
  static async getTree(projectUuid: string, segments: string) {
    return this.provider
      .getTree({ uuid: projectUuid, segments })
      .then((response) =>
        projectTreeSchema.nullable().parseAsync(response),
      )
  }
}
