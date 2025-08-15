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
import { ProjectTreeEntity } from "./project-tree.entity"

@Entity()
export class ProjectEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string

  @CreateDateColumn()
  created: Date

  @Index()
  @Column({ type: "date", nullable: true })
  lastVisited: Date | null

  @Column({ type: "text" })
  name: string

  @Column({ type: "boolean", default: false })
  pinned: boolean

  @Column({ type: "text" })
  description: string

  @ManyToMany(() => ProjectTagEntity, (tag) => tag.projects, {
    cascade: true,
    eager: true,
  })
  @JoinTable()
  tags: ProjectTagEntity[]

  @OneToMany(() => ProjectTreeEntity, (tree) => tree.project)
  trees: ProjectTreeEntity[]
}
