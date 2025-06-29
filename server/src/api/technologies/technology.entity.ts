import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "../projects/project.entity";

@Entity()
export class Technology {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Project, (project) => project.technologies)
  projects: Project[];
}
