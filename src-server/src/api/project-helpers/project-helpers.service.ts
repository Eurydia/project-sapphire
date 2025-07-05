import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Project } from "../projects/project.entity";
import { getProjectRootMetadata } from "src/common/utils/project-root-metadata.helper";

@Injectable()
export class ProjectHelpersService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  async exists(uuid: string) {
    return this.projectRepo.exists({ where: { uuid } });
  }

  async getMetadata(uuid: string) {
    return this.projectRepo
      .findOne({
        where: { uuid },
        select: { root: true },
      })
      .then((res) => {
        if (res === null) {
          throw new NotFoundException("Project not found");
        }
        return getProjectRootMetadata(res.root);
      });
  }
}
