import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm"
import { ProjectEntity } from "./project.entity"

@Entity()
export class ProjectTreeEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: number

  @ManyToOne(() => ProjectEntity, (project) => project.trees)
  project: ProjectEntity

  @Column({ type: "text", unique: true })
  path: string

  @Column({ type: "text", nullable: true })
  readme?: string
}
