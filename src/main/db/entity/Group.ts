import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm"
import { ProjectEntity } from "./project/project.entity"

@Entity()
export class GroupEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string

  @Column({ type: "varchar", length: 255 })
  name: string

  @Column({ type: "text", nullable: true })
  description?: string

  @Column({ type: "varchar", length: 50 })
  color: string

  @ManyToMany(() => ProjectEntity, (project) => project.groups)
  projects: ProjectEntity[]
}
