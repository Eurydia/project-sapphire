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
import { ProjectRepositoryEntity } from "./project-repository.entity"
import { ProjectTagEntity } from "./project-tag.entity"
import { ProjectWorkspaceEntity } from "./project-workspace.entity"

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

  @Column({ type: "text", nullable: true, default: null })
  description: string | null

  @ManyToMany(() => ProjectTagEntity, (tag) => tag.projects, {
    eager: true,
  })
  @JoinTable()
  tags: ProjectTagEntity[]

  @OneToMany(
    () => ProjectWorkspaceEntity,
    (workspace) => workspace.project,
    {
      cascade: ["insert"],
      orphanedRowAction: "delete",
      eager: true,
    },
  )
  workspaces: ProjectWorkspaceEntity[]

  @OneToMany(
    () => ProjectRepositoryEntity,
    (repository) => repository.project,
    {
      cascade: ["insert"],
      orphanedRowAction: "delete",
      eager: true,
    },
  )
  repositories: ProjectRepositoryEntity[]
}
