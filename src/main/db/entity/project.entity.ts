import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm"
import { GroupEntity } from "./Group"
import { TechnologyEntity } from "./Technology"
import { TopicEntity } from "./Topic"
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

  @Column({ type: "text", nullable: true })
  description: string | null

  @ManyToMany(() => TopicEntity, (topic) => topic.projects, {
    cascade: true,
    eager: true,
  })
  @JoinTable()
  topics: TopicEntity[]

  @ManyToMany(() => TechnologyEntity, (tech) => tech.projects, {
    cascade: true,
    eager: true,
  })
  @JoinTable()
  techs: TechnologyEntity[]

  @ManyToMany(() => GroupEntity, (group) => group.projects, {
    cascade: true,
    eager: true,
  })
  @JoinTable()
  groups: GroupEntity[]

  @OneToMany(() => ProjectTreeEntity, (tree) => tree.project)
  trees: ProjectTreeEntity[]
}
