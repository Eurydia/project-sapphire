import { Project } from "src/projects/project.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class ProjectTree {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Project, (project) => project.trees, { onDelete: "CASCADE" })
  @JoinColumn({ name: "project_id" })
  project: Project;

  @Column()
  path: string;

  @Column({ nullable: true, type: "text" })
  readme?: string | null;
}
