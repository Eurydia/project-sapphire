import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "../projects/project.entity";

@Entity()
export class Topic {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Project, (project) => project.topics)
  projects: Project[];
}
