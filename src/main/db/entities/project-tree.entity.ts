import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class ProjectTreeEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: number

  @Column({ type: "text", unique: true })
  path: string

  @Column({ type: "text", nullable: true })
  readme?: string
}
