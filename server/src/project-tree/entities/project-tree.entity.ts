import { Project } from "src/projects/project.entity";
import { Column, PrimaryGeneratedColumn } from "typeorm";

export class ProjectTree {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  project: Project;
  @Column()
  path: string;
  readme?: string | null | undefined;
}
