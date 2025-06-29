import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateTopicDto } from "./dto/create-topic.dto";
import { Topic } from "./topic.entity";

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic)
    private readonly repo: Repository<Topic>,
  ) {}

  async create(dto: CreateTopicDto): Promise<Topic> {
    const topic = this.repo.create({
      name: dto.name,
    });
    return this.repo.save(topic);
  }

  async findAll() {
    return this.repo.find({ order: { name: "ASC" } });
  }
}
