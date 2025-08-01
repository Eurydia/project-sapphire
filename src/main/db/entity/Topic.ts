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
  uuid!: string

  @Column({ type: "varchar", length: 255 })
  name!: string

  @Column({ type: "varchar", length: 50 })
  color!: string

  @ManyToMany(() => ProjectEntity, (project) => project.topics)
  projects!: ProjectEntity[]
}
