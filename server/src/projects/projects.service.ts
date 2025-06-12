import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Project } from "./projects.entity";

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepo: Repository<Project>,
  ) {}

  create(data: Partial<Project>) {
    const project = this.projectsRepo.create(data);
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
