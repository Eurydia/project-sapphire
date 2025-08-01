import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm"
import { ProjectEntity } from "./project.entity"

@Entity()
export class GroupEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string

  @Column({ type: "text", default: "" })
  description: string

  @Column({ type: "text" })
  name: string

  @Column({ type: "text", default: "#ffffff" })
  color: string

  @ManyToMany(() => ProjectEntity, (project) => project.groups)
  projects: ProjectEntity[]
}
