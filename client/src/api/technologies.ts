import { projectTechnologySchema } from "@/types/projects/project.entity";
import { API_CLIENT } from "./client";

export const fetchTechnologyAll = async () => {
  return API_CLIENT.get("/technologies").then((res) =>
    projectTechnologySchema.array().parseAsync(res.data),
  );
};
