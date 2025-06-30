import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { CreateTopicDto } from "./dto/create-topic.dto";
import { Topic } from "./topic.entity";

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic)
    private readonly repo: Repository<Topic>,
  ) {}

  async create(dto: CreateTopicDto): Promise<Topic> {
    const entry = this.repo.create({
      name: dto.name,
    });
    return this.repo.insert(entry).then(() => entry);
  }

  async findAll() {
    return this.repo.find({ order: { name: "ASC" } });
  }

  async createManyFromNames(entries: string[]) {
    const dtoEntries = entries.map((name) => ({ name }));
    const existingEntries = await this.repo.findBy({
      name: In(dtoEntries),
    });
    const existingEntriesSet = new Set(existingEntries.map((t) => t.name));
    const novel = entries.filter((name) => !existingEntriesSet.has(name));
    const requests = novel.map((name) => this.create({ name }));
    return Promise.all(requests);
  }
}
