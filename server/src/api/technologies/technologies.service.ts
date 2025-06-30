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
    });
    return this.repo.insert(entry).then(() => entry);
  }

  async findAll() {
    return this.repo.find();
  }

  async createManyFromNames(entries: string[]) {
    const dtoEntries = entries.map((name) => ({ name }));
    const existing = await this.repo.findBy({
      name: In(dtoEntries),
    });
    const existingSet = new Set(existing.map((t) => t.name));
    const novel = entries.filter((name) => !existingSet.has(name));
    const requests = novel.map((name) => this.create({ name }));
    return Promise.all(requests);
  }
}
