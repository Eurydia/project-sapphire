import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm"
import { ProjectEntity } from "./project.entity"

@Entity()
export class TopicEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string

  @Column({ type: "text", unique: true })
  name: string

  @Column({ type: "text", default: "#ffffff" })
  color: string

  @ManyToMany(() => ProjectEntity, (project) => project.topics)
  projects: ProjectEntity[]
}
