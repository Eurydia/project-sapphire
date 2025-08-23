import {
  EntitySubscriberInterface,
  EventSubscriber,
} from "typeorm"
import { ProjectEntity } from "../entities/project.entity"

@EventSubscriber()
export class SortProjectRelations
  implements EntitySubscriberInterface<ProjectEntity>
{
  listenTo() {
    return ProjectEntity
  }

  afterLoad(entity: ProjectEntity) {
    if (Array.isArray(entity.tags)) {
      entity.tags.sort((a, b) => {
        if (a.name === undefined || b.name === undefined) {
          return 0
        }
        return a.name.localeCompare(b.name)
      })
    }
    if (Array.isArray(entity.workspaces)) {
      entity.workspaces.sort((a, b) => {
        if (
          b.createdAt === undefined ||
          a.createdAt === undefined
        ) {
          return 0
        }
        return b.createdAt.getTime() - a.createdAt.getTime()
      })
    }
    if (Array.isArray(entity.repositories)) {
      entity.repositories.sort((a, b) => {
        if (
          b.createdAt === undefined ||
          a.createdAt === undefined
        ) {
          return 0
        }
        return b.createdAt.getTime() - a.createdAt.getTime()
      })
    }
  }
}
