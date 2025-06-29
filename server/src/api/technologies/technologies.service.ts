import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateTechnologyDto } from "./dto/create-technology.dto";
import { Technology } from "./technology.entity";

@Injectable()
export class TechnologiesService {
  constructor(
    @InjectRepository(Technology)
    private readonly repo: Repository<Technology>,
  ) {}

  async create(dto: CreateTechnologyDto): Promise<Technology> {
    const tech = this.repo.create({
      name: dto.name,
    });
    return this.repo.save(tech);
  }

  async findAll() {
    return this.repo.find();
  }
}
