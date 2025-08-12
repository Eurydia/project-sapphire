// src/subscribers/user-access.subscriber.ts (TypeORM v0.3.x)
import {
  EntitySubscriberInterface,
  EventSubscriber,
  LoadEvent,
} from "typeorm"
import { ProjectEntity } from "../entity/project.entity"

@EventSubscriber()
export class UserAccessSubscriber
  implements EntitySubscriberInterface<ProjectEntity>
{
  listenTo() {
    return ProjectEntity
  }

  // Called each time a User entity is loaded through TypeORM
  async afterLoad(
    entry: ProjectEntity,
    event: LoadEvent<ProjectEntity>,
  ) {
    // throttle writes so bulk lists don't spam updates
    await event.manager.getRepository(ProjectEntity).update(
      {
        uuid: entry.uuid,
      },
      { lastOpened: () => "CURRENT_TIMESTAMP" },
    )
  }
}
