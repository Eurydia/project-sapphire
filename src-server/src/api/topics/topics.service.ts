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
      color: dto.color,
    });
    return this.repo.save(entry).then(() => entry);
  }

  async findAll() {
    return this.repo.find({ order: { name: "ASC" } });
  }

  async createManyFromNames(entries: string[]) {
    const existingEntries = await this.repo.findBy({
      name: In(entries),
    });
    const existingEntriesSet = new Set(existingEntries.map((t) => t.name));
    const novel = entries.filter((name) => !existingEntriesSet.has(name));
    const requests = novel.map((name) => this.create({ name }));
    return Promise.all(requests);
  }

  async findFromProject(uuid: string) {
    return this.repo.find({
      where: { projects: { uuid } },
    });
  }
}
