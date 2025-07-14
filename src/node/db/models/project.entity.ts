import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Technology } from "./technology.entity";
import { Topic } from "./topic.entity";

@Entity()
export class Project {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "text" })
  root: string;

  @Column({ type: "text", nullable: true, default: null })
  description: string | null;

  @Column({ type: "boolean", default: false })
  pinned: boolean;

  @ManyToMany(() => Topic, (topic) => topic.projects, {
    cascade: true,
  })
  @JoinTable({ name: "project_topics" })
  topics: Topic[];

  @ManyToMany(() => Technology, (tech) => tech.projects, {
    cascade: true,
  })
  @JoinTable({ name: "project_technologies" })
  technologies: Technology[];
}
