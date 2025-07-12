import { In } from "typeorm";
import { Topic } from "../models/topic.entity";
import { DATA_SOURCE } from "../data-source";
import { DatasourceService } from "./registry";

const REPO = DATA_SOURCE.getRepository(Topic);

type Data = {
  name: string;
  color?: string;
};

export class TopicService {
  @DatasourceService()
  async create({ name, color }: Data) {
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
    return await Promise.all(requests);
  }

  @DatasourceService()
  async getAll() {
    return REPO.find();
  }
}
