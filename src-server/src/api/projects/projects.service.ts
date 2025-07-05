import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { normalize } from "path";
import { Repository } from "typeorm";
import { TechnologiesService } from "../technologies/technologies.service";
import { TopicsService } from "../topics/topics.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { Project } from "./project.entity";
import { UpdateProjectDto } from "./dto/update-project.dto";

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    private readonly topicsSvc: TopicsService,
    private readonly technologiesSvc: TechnologiesService,
  ) {}

  async create(dto: CreateProjectDto) {
    const project = this.projectRepo.create({
      name: dto.name,
      root: normalize(dto.root),
      description: dto.description,
    });

    project.technologies = await this.technologiesSvc.createManyFromNames(
      dto.technologies,
    );
    project.topics = await this.topicsSvc.createManyFromNames(dto.topics);
    return this.projectRepo.save(project);
  }

  async findAll() {
    return this.projectRepo.find({
      order: { name: "ASC" },
      relations: {
        technologies: true,
        topics: true,
      },
    });
  }

  async findOne(uuid: string) {
    return this.projectRepo.findOne({
      where: { uuid },
      relations: { technologies: true, topics: true },
    });
  }

  async update(uuid: string, dto: UpdateProjectDto) {
    const technologies = await this.technologiesSvc.createManyFromNames(
      dto.technologies,
    );

    const topics = await this.topicsSvc.createManyFromNames(dto.topics);

    return this.projectRepo.save({
      uuid,
      description: dto.description,
      name: dto.name,
      root: dto.root,
      technologies,
      topics,
    });
  }

  delete(id: string) {
    return this.projectRepo.softDelete(id);
  }
}
