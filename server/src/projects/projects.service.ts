import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { normalize } from "path";
import { getProjectRootMetadata } from "src/common/utils/project-root-metadata.helper";
import { Technology } from "src/technologies/technology.entity";
import { Topic } from "src/topics/topic.entity";
import { In, Repository } from "typeorm";
import { CreateProjectDto } from "./dto/create-project.dto";
import { Project } from "./project.entity";

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,

    @InjectRepository(Topic)
    private readonly topicRepo: Repository<Topic>,

    @InjectRepository(Technology)
    private readonly techRepo: Repository<Technology>,
  ) {}

  async create(dto: CreateProjectDto) {
    const project = this.projectRepo.create({
      name: dto.name,
      absPath: normalize(dto.absPath),
      description: dto.description ?? null,
    });

    if (dto.topics !== undefined && dto.topics.length > 0) {
      const existingTopics = await this.topicRepo.findBy({
        name: In(dto.topics),
      });
      const existingTopicNames = new Set(existingTopics.map((t) => t.name));
      const newTopicNames = dto.topics.filter(
        (name) => !existingTopicNames.has(name),
      );
      const newTopics = await Promise.all(
        newTopicNames.map(async (name) => {
          const topic = this.topicRepo.create({
            name,
          });
          return this.topicRepo.save(topic);
        }),
      );

      await this.topicRepo.save(newTopics);
      project.topics = [...existingTopics, ...newTopics];
    }

    if (dto.technologies !== undefined && dto.technologies.length > 0) {
      const existingTech = await this.techRepo.findBy({
        name: In(dto.technologies),
      });
      const existingTechNames = new Set(existingTech.map((t) => t.name));

      const newTechNames = dto.technologies.filter(
        (name) => !existingTechNames.has(name),
      );

      const newTech = await Promise.all(
        newTechNames.map(async (name) => {
          const tech = this.techRepo.create({
            name,
          });
          return this.techRepo.save(tech);
        }),
      );

      project.technologies = [...existingTech, ...newTech];
    }

    return this.projectRepo.save(project);
  }

  async findAll() {
    const projectsBase = await this.projectRepo.find({
      relations: ["technologies", "topics"],
      order: { name: "ASC" },
    });
    return projectsBase.map((projectBase) => {
      const metadata = getProjectRootMetadata(projectBase.absPath);
      return {
        ...projectBase,
        metadata,
      };
    });
  }

  async findOne(id: string) {
    const projectBase = await this.projectRepo.findOne({
      where: { id },
      relations: ["technologies", "topics"],
    });

    if (projectBase === null) {
      return null;
    }

    const metadata = getProjectRootMetadata(projectBase.absPath);
    return {
      ...projectBase,
      metadata,
    };
  }

  update(id: string, data: Partial<Project>) {
    return this.projectRepo.update(id, data);
  }

  remove(id: string) {
    return this.projectRepo.delete(id);
  }
}
