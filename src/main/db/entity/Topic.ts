import {
  Column,
  Entity,
  ManyToMany,
  PrimaryColumn,
} from "typeorm"
import { ProjectEntity } from "./project.entity"

@Entity()
export class TopicEntity {
  @PrimaryColumn("uuid")
  uuid: string

  @Column({ type: "text" })
  name: string

  @Column({ type: "text", default: "#ffffff" })
  color: string

  @ManyToMany(() => ProjectEntity, (project) => project.topics)
  projects: ProjectEntity[]
}
