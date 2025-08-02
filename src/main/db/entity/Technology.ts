import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm"
import { ProjectEntity } from "./project.entity"

@Entity()
export class TechnologyEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string

  @Column({ type: "text", unique: true })
  name: string

  @Column({ type: "text", default: "#ffffff" })
  color: string

  @ManyToMany(() => ProjectEntity, (project) => project.techs)
  projects: ProjectEntity[]
}
