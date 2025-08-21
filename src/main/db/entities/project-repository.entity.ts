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
export class ProjectRepositoryEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string

  @CreateDateColumn()
  createdAt: Date

  @Column({ type: "text" })
  name: string

  @Column({ type: "text" })
  url: string

  @ManyToOne(
    () => ProjectEntity,
    (project) => project.repositories,
    { onDelete: "CASCADE", nullable: false },
  )
  @JoinColumn()
  project: ProjectEntity
}
