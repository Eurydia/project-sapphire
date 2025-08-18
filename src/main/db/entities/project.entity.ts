import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm"
import { ProjectTagEntity } from "./project-tag.entity"
import { ProjectTaskEntity } from "./project-task.entity"

@Entity()
export class ProjectEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string

  @CreateDateColumn()
  created: Date

  @Index()
  @Column({ type: "date", nullable: true })
  lastVisited: Date | null

  @Index()
  @Column({ type: "text" })
  name: string

  @Column({ type: "boolean", default: false })
  pinned: boolean

  @Column({ type: "text" })
  description: string

  @ManyToMany(() => ProjectTagEntity, (tag) => tag.projects, {
    cascade: true,
  })
  @JoinTable()
  tags: ProjectTagEntity[]

  @OneToMany(() => ProjectTaskEntity, (task) => task.project, {
    cascade: true,
  })
  @JoinTable()
  tasks: ProjectTaskEntity[]
}
