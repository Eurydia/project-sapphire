import { In } from "typeorm";
import { Technology } from "../models/technology.entity";
import { DATA_SOURCE } from "../data-source";
import { DatasourceService } from "./registry";

const REPO = DATA_SOURCE.getRepository(Technology);

type CreateDto = {
  name: string;
  color?: string;
};

export class TechnologyService {
  @DatasourceService()
  async getAll() {
    return REPO.find();
  }

  @DatasourceService()
  async create({ name, color }: CreateDto) {
    const entry = REPO.create({ name, color });
    return REPO.save(entry);
  }

  @DatasourceService()
  async createManyByNames(names: string[]) {
    const existing = await REPO.findBy({
      name: In(names),
    });

    const existingSet = new Set(existing.map(({ name }) => name));
    const novel = names.filter((name) => !existingSet.has(name));
    const requests = novel.map((name) => REPO.save(REPO.create({ name })));
    return Promise.all(requests);
  }
}
