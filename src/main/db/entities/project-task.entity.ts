import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm"
import { ProjectEntity } from "./project.entity"

@Entity({ orderBy: { name: "ASC" } })
export class ProjectTaskEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string

  @Column({ type: "text" })
  name: string

  @Column({ type: "text", default: "" })
  description: string

  @ManyToOne(() => ProjectEntity, (project) => project.tags)
  project: ProjectEntity[]

  @CreateDateColumn()
  createdAt: Date
}
