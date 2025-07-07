import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { CreateTechnologyDto } from "./dto/create-technology.dto";
import { Technology } from "./technology.entity";

@Injectable()
export class TechnologiesService {
  constructor(
    @InjectRepository(Technology)
    private readonly repo: Repository<Technology>,
  ) {}

  async create(dto: CreateTechnologyDto): Promise<Technology> {
    const entry = this.repo.create({
      name: dto.name,
      color: dto.color,
    });
    return this.repo.save(entry).then(() => entry);
  }

  async findAll() {
    return this.repo.find();
  }

  async createManyFromNames(entries: string[]) {
    const existing = await this.repo.findBy({
      name: In(entries),
    });
    const existingSet = new Set(existing.map((t) => t.name));
    const novel = entries.filter((name) => !existingSet.has(name));
    const requests = novel.map((name) => this.create({ name }));
    return Promise.all(requests);
  }

  async findFromProject(uuid: string) {
    return this.repo.find({
      where: { projects: { uuid } },
    });
  }
}
