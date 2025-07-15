import { technologySchema } from "~/models/technologies/technologies";

export const fetchTechnologyAll = () =>
  window.db$tech
    .getAll()
    .then((resp) => technologySchema.array().parseAsync(resp))
    .catch(() => []);
