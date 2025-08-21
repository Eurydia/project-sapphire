import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm"
import { ProjectEntity } from "./project.entity"

@Entity()
export class ProjectWorkspaceEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string

  @CreateDateColumn()
  createdAt: Date

  @Column({ type: "text", unique: false })
  name: string

  @Column({ type: "text" })
  root: string

  @ManyToOne(
    () => ProjectEntity,
    (project) => project.workspaces,
    { onDelete: "CASCADE", nullable: false },
  )
  @JoinColumn()
  project: ProjectEntity
}
