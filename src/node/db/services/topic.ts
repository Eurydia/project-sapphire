import { In } from "typeorm";
import { DATA_SOURCE } from "../data-source";
import { Topic } from "../models/topic.entity";

const REPO = DATA_SOURCE.getRepository(Topic);

type Dto = {
  name: string;
  color?: string;
};

const create = ({ name, color }: Dto) => {
  const entry = REPO.create({ name, color });
  return REPO.save(entry);
};

const createManyByNames = async (names: string[]) => {
  const existing = await REPO.findBy({
    name: In(names),
  });
  const existingSet = new Set(existing.map(({ name }) => name));

  const novel = names.filter((name) => !existingSet.has(name));
  const requests = novel.map((name) => REPO.save(REPO.create({ name })));
  return (await Promise.all(requests)).concat(existing);
};

const getAll = () => REPO.find();

export const TOPIC_SERVICES = {
  create,
  createManyByNames,
  getAll,
};
