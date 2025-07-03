import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { normalize } from "path";
import { Repository } from "typeorm";
import { TechnologiesService } from "../technologies/technologies.service";
import { TopicsService } from "../topics/topics.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { Project } from "./project.entity";
import { getProjectRootMetadata } from "src/common/utils/project-root-metadata.helper";

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
    return this.projectRepo
      .find({
        order: { name: "ASC" },
        relations: {
          technologies: true,
          topics: true,
        },
      })
      .then((res) =>
        res.map((entry) => ({
          ...entry,
          metadata: getProjectRootMetadata(entry.root),
        })),
      );
  }

  async findOne(uuid: string) {
    const project = await this.projectRepo.findOne({
      where: { uuid },
      relations: { technologies: true, topics: true },
    });
    if (project === null) {
      throw new NotFoundException("Project not found");
    }
    return { ...project, metadata: getProjectRootMetadata(project.root) };
  }

  update(id: string, data: Partial<Project>) {
    return this.projectRepo.update(id, data);
  }

  delete(id: string) {
    return this.projectRepo.softDelete(id);
  }
}
