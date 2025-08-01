import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm"
import { ProjectEntity } from "./project.entity"

@Entity()
@Unique(["project", "path"])
export class ProjectTreeEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: number

  @Column("text")
  path: string

  @Column({ type: "text", nullable: true })
  readme?: string

  @ManyToOne(() => ProjectEntity, (project) => project.trees, {
    nullable: false,
  })
  @JoinColumn()
  project: ProjectEntity
}
