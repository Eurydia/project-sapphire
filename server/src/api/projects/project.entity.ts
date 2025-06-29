import { ProjectTree } from "src/api/project-tree/entities/project-tree.entity";
import { Technology } from "src/api/technologies/technology.entity";
import { Topic } from "src/api/topics/topic.entity";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Project {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column()
  name: string;

  @Column()
  absPath: string;

  @Column({ type: "text", nullable: true })
  description?: string | null;

  @ManyToMany(() => Topic, (topic) => topic.projects, {
    cascade: true,
    eager: true,
  })
  @JoinTable({ name: "project_topics" })
  topics: Topic[];

  @ManyToMany(() => Technology, (tech) => tech.projects, {
    cascade: true,
    eager: true,
  })
  @JoinTable({ name: "project_technologies" })
  technologies: Technology[];

  @OneToMany(() => ProjectTree, (tree) => tree.project)
  trees: ProjectTree[];
}
