import type { CreateProjectDto } from "@/types/projects/dto/create-project.dto";
import { projectSchema, type Project } from "@/types/projects/project.entity";
import axios from "axios";

export class ProjectService {
  private static readonly CLIENT = axios.create({
    baseURL: `${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}`,
  });

  public static async findAll() {
    return this.CLIENT.get<Project[]>(`/projects`).then((res) =>
      projectSchema.array().parseAsync(res.data),
    );
  }

  public static async find(id: string) {
    return this.CLIENT.get<Project>(`/projects/${id}`)
      .then((res) => {
        return res.data;
      })
      .catch(() => null);
  }

  public static async create(dto: CreateProjectDto) {
    return await this.CLIENT.post<Project>(`/projects`, dto).then(
      (res) => res.data,
    );
  }

  public static async delete(id: string) {
    return await this.CLIENT.delete(`/projects/${id}`);
  }
}
