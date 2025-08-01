import {
  Column,
  Entity,
  ManyToMany,
  PrimaryColumn,
} from "typeorm"
import { ProjectEntity } from "./project.entity"

@Entity()
export class TechnologyEntity {
  @PrimaryColumn("uuid")
  uuid: string

  @Column({ type: "text" })
  name: string

  @Column({ type: "text", default: "#ffffff" })
  color: string

  @ManyToMany(() => ProjectEntity, (project) => project.techs)
  projects: ProjectEntity[]
}
