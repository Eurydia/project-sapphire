import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { normalize } from "path";
import { Repository } from "typeorm";
import { TechnologiesService } from "../technologies/technologies.service";
import { TopicsService } from "../topics/topics.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { Project } from "./project.entity";
import { UpdateProjectDto } from "./dto/update-project.dto";
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

  async getAll() {
    return (
      await this.projectRepo.find({
        order: { pinned: "DESC", name: "ASC" },
        relations: {
          technologies: true,
          topics: true,
        },
      })
    ).map((p) => ({ ...p, metadata: getProjectRootMetadata(p) }));
  }

  async getOne(uuid: string) {
    const p = await this.projectRepo.findOne({
      where: { uuid },
      relations: { technologies: true, topics: true },
    });
    if (p === null) {
      return null;
    }

    return { ...p, metadata: getProjectRootMetadata(p) };
  }

  async pin(uuid: string) {
    const project = await this.projectRepo.findOne({ where: { uuid } });
    if (project === null) {
      throw new NotFoundException();
    }
    project.pinned = true;
    return this.projectRepo.save(project).then(() => project);
  }

  async unpin(uuid: string) {
    const project = await this.projectRepo.findOne({ where: { uuid } });
    if (project === null) {
      throw new NotFoundException();
    }
    project.pinned = false;
    return this.projectRepo.save(project).then(() => project);
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

  async delete(uuid: string) {
    return this.projectRepo.softDelete({ uuid });
  }
}
