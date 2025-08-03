import {
  Column,
  Entity,
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

  @Column({ type: "text" })
  name: string

  @Column({ type: "text" })
  root: string

  @Column({ type: "boolean", default: false })
  pinned: boolean

  @Column({ type: "text" })
  description: string

  @ManyToMany(
    () => ProjectTagEntity,
    (group) => group.projects,
    {
      cascade: true,
      eager: true,
    },
  )
  @JoinTable()
  tags: ProjectTagEntity[]

  @OneToMany(() => ProjectTreeEntity, (tree) => tree.project)
  trees: ProjectTreeEntity[]
}
