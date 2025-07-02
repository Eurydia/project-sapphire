import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { normalize } from "path";
import { getProjectRootMetadata } from "src/common/utils/project-root-metadata.helper";
import { Repository } from "typeorm";
import { TechnologiesService } from "../technologies/technologies.service";
import { TopicsService } from "../topics/topics.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { Project } from "./project.entity";

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
      absPath: normalize(dto.absPath),
      description: dto.description,
    });

    project.technologies = await this.technologiesSvc.createManyFromNames(
      dto.technologies,
    );
    project.topics = await this.topicsSvc.createManyFromNames(dto.topics);
    return this.projectRepo.insert(project);
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

  async findOne(uuid: string) {
    const projectBase = await this.projectRepo.findOne({
      where: { uuid },
      relations: ["technologies", "topics"],
    });

    if (projectBase === null) {
      throw new NotFoundException("Project not found");
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

  delete(id: string) {
    return this.projectRepo.softDelete(id);
  }
}
