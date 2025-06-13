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
    if (!isAbsolute(dto.path)) {
      throw new BadRequestException(`Path "${dto.path}" is not absolute`);
    }

    if (!existsSync(dto.path)) {
      throw new BadRequestException(
        `Path "${dto.path}" does not exist on disk`,
      );
    }

    // 2) Check for DB path collision
    const existing = await this.projectsRepo.findOne({
      where: { path: dto.path },
    });
    if (existing) {
      throw new BadRequestException(
        `Path "${dto.path}" is already used by project id ${existing.id}`,
      );
    }

    // 3) Create & save
    const project = this.projectsRepo.create(dto);
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
