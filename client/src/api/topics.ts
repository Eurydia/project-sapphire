import { projectTopicSchema } from "@/types/projects/project.entity";
import { API_CLIENT } from "./client";

export const fetchTopicAll = async () => {
  return API_CLIENT.get("/topics")
    .then(({ data }) => projectTopicSchema.array().parseAsync(data))
    .catch(() => []);
};
