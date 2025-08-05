import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm"
import { ProjectEntity } from "./project.entity"

@Entity()
export class ProjectTagEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string

  @Column({ type: "text", unique: true })
  name: string

  @Column({ type: "boolean", default: false })
  pinned: boolean

  @Column({ type: "text", default: "" })
  description: string

  @Column({ type: "text", default: "#ffffff" })
  color: string

  @ManyToMany(() => ProjectEntity, (project) => project.tags)
  projects: ProjectEntity[]
}
