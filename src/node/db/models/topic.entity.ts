import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Project } from './project.entity'

@Entity()
export class Topic {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @Column({ type: 'text' })
  name: string

  @Column({ type: 'text', length: 7, default: '#999999' })
  color: string

  @ManyToMany(() => Project, (project) => project.technologies)
  projects: Project[]
}
