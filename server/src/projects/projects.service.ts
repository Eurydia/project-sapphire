import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { existsSync } from "fs";
import { isAbsolute } from "path";
import { Repository } from "typeorm";
import { CreateProjectDto } from "./dto/create-project.dto";
import { Project } from "./projects.entity";

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepo: Repository<Project>,
  ) {}

  async create(dto: CreateProjectDto) {
    if (!isAbsolute(dto.absPath)) {
      throw new BadRequestException(`Path "${dto.absPath}" is not absolute`);
    }

    if (!existsSync(dto.absPath)) {
      throw new BadRequestException(
        `Path "${dto.absPath}" does not exist on disk`,
      );
    }

    const existing = await this.projectsRepo.findOne({
      where: { absPath: dto.absPath },
    });
    if (existing) {
      throw new BadRequestException(
        `Path "${dto.absPath}" is already used by project id ${existing.id}`,
      );
    }
    const now = new Date();
    const project = this.projectsRepo.create({
      ...dto,
      createdAt: now,
      modifiedAt: now,
    });
    return this.projectsRepo.save(project);
  }

  findAll() {
    return this.projectsRepo.find();
  }

  findOne(id: number) {
    return this.projectsRepo.findOneBy({ id });
  }

  update(id: number, data: Partial<Project>) {
    return this.projectsRepo.update(id, data);
  }

  remove(id: number) {
    return this.projectsRepo.delete(id);
  }
}
