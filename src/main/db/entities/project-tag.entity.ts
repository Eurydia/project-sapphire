import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm"
import { ProjectEntity } from "./project.entity"

@Entity({ orderBy: { name: "ASC" } })
export class ProjectTagEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string

  @Column({ type: "boolean", default: false })
  pinned: boolean

  @Column({ type: "text", unique: true })
  name: string

  @Column({ type: "text", default: "" })
  description: string

  @ManyToMany(() => ProjectEntity, (project) => project.tags)
  projects: ProjectEntity[]
}
