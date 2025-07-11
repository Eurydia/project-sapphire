import { In } from "typeorm";
import { Technology } from "../models/technology.entity";
import { DATA_SOURCE } from "../data-source";

const REPO = DATA_SOURCE.getRepository(Technology);

type CreateDto = {
  name: string;
  color?: string;
};

export const technology$create = async ({ name, color }: CreateDto) => {
  const entry = REPO.create({ name, color });
  return REPO.save(entry);
};

export const technology$createManyByNames = async (names: string[]) => {
  const existing = await REPO.findBy({
    name: In(names),
  });
  const existingSet = new Set(existing.map(({ name }) => name));

  const novel = names.filter((name) => !existingSet.has(name));
  const requests = novel.map((name) => REPO.save(REPO.create({ name })));
  return Promise.all(requests);
};

export const technology$getAll = async () => {
  return REPO.find();
};
