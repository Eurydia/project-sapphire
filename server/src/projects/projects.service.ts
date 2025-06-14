import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomColorHex } from "src/common/utils/colorHex";
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

  async create(dto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepo.create({
      name: dto.name,
      absPath: dto.absPath,
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
            colorHex: randomColorHex(),
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
            colorHex: randomColorHex(),
          });
          return this.techRepo.save(tech);
        }),
      );

      project.technologies = [...existingTech, ...newTech];
    }

    return this.projectRepo.save(project);
  }

  findAll() {
    return this.projectRepo.find({ relations: ["technologies", "topics"] });
  }

  findOne(id: string) {
    return this.projectRepo.findOne({
      where: { id },
      relations: ["technologies", "topics"],
    });
  }

  update(id: string, data: Partial<Project>) {
    return this.projectRepo.update(id, data);
  }

  remove(id: string) {
    return this.projectRepo.delete(id);
  }
}
