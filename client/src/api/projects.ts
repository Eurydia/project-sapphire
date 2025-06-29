import type { CreateProjectDto } from "@/types/projects/dto/create-project.dto";
import { projectSchema } from "@/types/projects/project.entity";
import { API_CLIENT } from "./client";

export const fetchAllProject = async () => {
  return API_CLIENT.get("/projects").then((res) =>
    projectSchema.array().parseAsync(res.data),
  );
};

export const fetchProject = async (uuid: string) => {
  return API_CLIENT.get(`/projects/${uuid}`)
    .then((res) => projectSchema.parseAsync(res.data))
    .catch(() => null);
};

export const createProject = async (dto: CreateProjectDto) => {
  return API_CLIENT.post("/projects", dto);
};

export const deleteProject = async (uuid: string) => {
  return API_CLIENT.delete(`/projects/${uuid}`);
};
