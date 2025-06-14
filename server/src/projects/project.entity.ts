import { Technology } from "src/technologies/technology.entity";
import { Topic } from "src/topics/topic.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  absPath: string;

  @Column({ type: "text", nullable: true })
  description?: string | null;

  @CreateDateColumn({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
  })
  modifiedAt: Date;

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
}
