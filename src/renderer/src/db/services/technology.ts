// import { In } from "typeorm";
// import { DATA_SOURCE } from "../data-source";
// import { Technology } from "../models/technology.entity";

// const REPO = DATA_SOURCE.getRepository(Technology);

// type Dto = {
//   name: string;
//   color?: string;
// };

// const getAll = () => REPO.find();

// const create = ({ name, color }: Dto) => {
//   const entry = REPO.create({ name, color });
//   return REPO.save(entry);
// };

// const createManyByNames = async (names: string[]) => {
//   const existing = await REPO.findBy({
//     name: In(names),
//   });

//   const existingSet = new Set(existing.map(({ name }) => name));
//   const novel = names.filter((name) => !existingSet.has(name));
//   const requests = novel.map((name) => REPO.save(REPO.create({ name })));
//   return (await Promise.all(requests)).concat(existing);
// };

// export const TECH_SERVICES = {
//   getAll,
//   create,
//   createManyByNames,
// };
