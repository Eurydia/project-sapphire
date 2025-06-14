import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomColorHex } from "src/common/utils/colorHex";
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
      colorHex: dto.colorHex ?? randomColorHex(),
    });
    return this.repo.save(tech);
  }
}
