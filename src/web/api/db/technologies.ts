import { technologySchema } from "~/models/technologies/technologies";

export const listTech = () =>
  window.db$tech
    .getAll()
    .then(technologySchema.array().parseAsync)
    .catch(() => []);
